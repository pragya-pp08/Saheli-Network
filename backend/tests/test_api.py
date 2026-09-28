"""Offline API contract tests. No production accounts or payment calls."""
import copy
import hashlib
import hmac
import json
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
import app as api
from domain import earnings_summary, distance_km


class Snapshot:
    def __init__(self, ident, data):
        self.id, self.data, self.exists = ident, copy.deepcopy(data), data is not None
    def to_dict(self):
        return copy.deepcopy(self.data)


class Ref:
    def __init__(self, store, collection, ident):
        self.store, self.collection, self.id = store, collection, ident
    def get(self, transaction=None):
        return Snapshot(self.id, self.store.data.get((self.collection, self.id)))
    def set(self, data, merge=False):
        key = (self.collection, self.id)
        self.store.data[key] = {**(self.store.data.get(key, {}) if merge else {}), **copy.deepcopy(data)}
    def update(self, data):
        self.set(data, merge=True)


class Collection:
    def __init__(self, store, name, filter=None):
        self.store, self.name, self.filter = store, name, filter
    def document(self, ident=None):
        if ident is None:
            self.store.sequence += 1
            ident = f'doc{self.store.sequence}'
        return Ref(self.store, self.name, ident)
    def where(self, filter):
        return Collection(self.store, self.name, filter)
    def stream(self):
        return [Snapshot(ident, data) for (collection, ident), data in self.store.data.items()
                if collection == self.name and (not self.filter or data.get(self.filter.field_path) == self.filter.value)]


class Store:
    def __init__(self):
        self.data, self.sequence = {}, 0
    def collection(self, name):
        return Collection(self, name)
    def transaction(self):
        return self
    def set(self, ref, data):
        ref.set(data)
    def update(self, ref, data):
        ref.update(data)


@pytest.fixture
def client(monkeypatch):
    store = Store()
    monkeypatch.setattr(api, 'db', lambda: store)
    # This exercises endpoint logic; Firestore contention needs emulator/live tests.
    monkeypatch.setattr(api.firestore, 'transactional', lambda fn: fn)
    api.app.dependency_overrides[api.current_user] = lambda: {'uid': 'worker', 'name': 'Test Worker'}
    with TestClient(api.app) as client:
        yield client
    api.app.dependency_overrides.clear()


def as_user(uid):
    api.app.dependency_overrides[api.current_user] = lambda: {'uid': uid, 'name': uid}


def switch_mode(client, uid, mode):
    as_user(uid)
    response = client.post('/account-mode', json={'mode': mode})
    assert response.status_code == 200


def make_order(client):
    client.patch('/profile', json={'name':'Worker', 'skills':['Tailoring'], 'location':'Test Area'})
    switch_mode(client, 'customer', 'customer')
    job = client.post('/opportunities', json=dict(title='Blouse stitching', category='Tailoring', amountPaise=60000,
        location='Test Area', address='Private address', phone='1234567890', date='2026-12-01', time='10 AM')).json()['id']
    as_user('worker')
    assert client.post(f'/opportunities/{job}/apply').status_code == 200
    application = client.get('/applications').json()[0]['id']
    as_user('customer')
    assert client.post(f'/applications/{application}/accept').status_code == 200
    return job


def test_new_user_and_profile_ownership(client):
    p = client.get('/profile').json()
    assert p['earnings']['today'] == p['rating'] == p['jobs_completed'] == 0
    assert p['reviewList'] == p['orders'] == []
    assert client.get('/account-summary').json()['accountMode'] == 'worker'
    assert client.patch('/profile', json={'name':'A', 'rating':5}).status_code == 422
    assert client.patch('/profile', json={'name':'Saved', 'skills':['Mehndi']}).status_code == 200
    assert client.get('/profile').json()['name'] == 'Saved'
    as_user('other')
    assert client.get('/profile').json()['name'] == 'other'


def test_job_lifecycle_and_isolation(client):
    job = make_order(client)
    assert client.post(f'/orders/{job}/complete').status_code == 403
    as_user('outsider')
    assert client.get(f'/orders/{job}').status_code == 403
    assert client.get('/orders').json() == []
    as_user('worker')
    assert client.post(f'/orders/{job}/complete').json()['status'] == 'Completed'
    assert client.post(f'/orders/{job}/complete').status_code == 200
    assert client.get('/earnings').json()['pending'] == 600
    assert client.get('/earnings').json()['total'] == 0
    as_user('customer')
    assert client.post(f'/orders/{job}/review', json={'rating':5, 'text':'Good work'}).status_code == 200
    as_user('worker')
    assert client.get('/profile').json()['rating'] == 5


def test_applications_are_idempotent_and_private(client):
    client.patch('/profile', json={'name':'Worker','location':'Area','skills':['Cooking']})
    switch_mode(client, 'customer', 'customer')
    job = client.post('/opportunities', json=dict(title='Cooking lunch',category='Cooking',amountPaise=50000,
      location='Area', address='Private address',phone='1234567890',date='2026-12-01',time='Noon')).json()['id']
    assert client.post(f'/opportunities/{job}/apply').status_code == 403
    as_user('worker')
    listing = client.get('/opportunities').json()[0]
    assert 'phone' not in listing and 'address' not in listing and 'coordinates' not in listing
    assert client.post(f'/opportunities/{job}/apply').status_code == 200
    assert client.post(f'/opportunities/{job}/apply').status_code == 200
    assert len(client.get('/applications').json()) == 1


def test_account_modes_separate_customer_and_worker_actions(client):
    job_data = dict(title='Meal preparation', category='Cooking', amountPaise=70000,
                    location='Area', address='Private address', phone='1234567890',
                    date='2026-12-01', time='Noon')
    assert client.post('/opportunities', json=job_data).status_code == 403
    switch_mode(client, 'worker', 'customer')
    assert client.post('/opportunities', json=job_data).status_code == 200
    assert client.get('/opportunities').status_code == 403
    dashboard = client.get('/customer-dashboard')
    assert dashboard.status_code == 200
    assert dashboard.json()['posted'] == 1
    switch_mode(client, 'worker', 'worker')
    assert client.get('/customer-dashboard').status_code == 403


def test_own_post_is_visible_but_cannot_be_applied_to(client):
    client.patch('/profile', json={'name':'Dual Role User', 'skills':['Cooking'], 'location':'Area'})
    switch_mode(client, 'worker', 'customer')
    job = client.post('/opportunities', json=dict(title='Cook dinner', category='Cooking', amountPaise=50000,
        location='Area', address='Private address', phone='1234567890', date='2026-12-01', time='Evening')).json()['id']
    switch_mode(client, 'worker', 'worker')
    listing = client.get('/opportunities').json()
    assert len(listing) == 1 and listing[0]['id'] == job and listing[0]['isOwn'] is True
    assert client.post(f'/opportunities/{job}/apply').status_code == 409
    assert client.get('/dashboard').json()['new_opportunities'] == 0


def test_recovery_is_private(client):
    assert client.post('/recovery-support',json={'reason':'Income loss'}).status_code == 200
    assert client.get('/recovery-status').json()['active'] is True
    as_user('other')
    assert client.get('/recovery-status').json()['active'] is False


def test_payments_require_capture_and_are_idempotent(client, monkeypatch):
    job = make_order(client)
    as_user('worker')
    client.post(f'/orders/{job}/complete')
    as_user('customer')
    monkeypatch.setenv('RAZORPAY_KEY_ID','rzp_test_example')
    monkeypatch.setenv('RAZORPAY_KEY_SECRET','test-secret')
    payment = dict(id='pay_123',order_id='order_123',currency='INR',amount=60000,status='authorized')
    monkeypatch.setattr(api,'razorpay',lambda method,path,payload=None: {'id':'order_123'} if method == 'POST' else payment)
    assert client.post(f'/orders/{job}/payment').json()['amount'] == 60000
    data = dict(razorpay_order_id='order_123',razorpay_payment_id='pay_123',razorpay_signature='0'*64)
    assert client.post(f'/orders/{job}/payment/verify',json=data).status_code == 400
    data['razorpay_signature'] = hmac.new(b'test-secret',b'order_123|pay_123',hashlib.sha256).hexdigest()
    assert client.post(f'/orders/{job}/payment/verify',json=data).status_code == 409
    payment['status'] = 'captured'
    payment['amount'] = 1
    assert client.post(f'/orders/{job}/payment/verify',json=data).status_code == 409
    payment['amount'] = 60000
    assert client.post(f'/orders/{job}/payment/verify',json=data).status_code == 200
    assert client.post(f'/orders/{job}/payment/verify',json=data).status_code == 200
    monkeypatch.setenv('RAZORPAY_WEBHOOK_SECRET','webhook-secret')
    body=json.dumps({'event':'payment.captured','payload':{'payment':{'entity':payment}}}).encode()
    signature=hmac.new(b'webhook-secret',body,hashlib.sha256).hexdigest()
    assert client.post('/payments/webhook',content=body,headers={'x-razorpay-signature':'invalid'}).status_code == 400
    for _ in range(2):
        assert client.post('/payments/webhook',content=body,headers={'x-razorpay-signature':signature}).status_code == 200
    as_user('worker')
    summary=client.get('/earnings').json()
    assert summary['total'] == 600 and summary['pending'] == 0 and len(summary['history']) == 1


def test_protected_endpoint_requires_login():
    with TestClient(api.app) as client:
        assert client.get('/orders').status_code == 401


def test_earnings_boundaries_and_distance():
    def order(ident, paid, amount):
        return dict(id=ident, amountPaise=amount,paymentStatus='paid',paidAt=paid,service='Work',customer='Customer')
    result=earnings_summary([order('1','2026-09-05T19:00:00+00:00',10001),order('2','2025-09-01T00:00:00+00:00',20000)],
      now=datetime.fromisoformat('2026-09-06T10:00:00+05:30'))
    assert result['today'] == 100.01 and result['month'] == 100.01
    assert result['total'] == 300.01 and result['year'] == 100.01
    assert distance_km({'lat':0,'lng':0},{'lat':0,'lng':0}) == 0
    assert 111 <= distance_km({'lat':0,'lng':0},{'lat':0,'lng':1}) <= 112


def test_notifications_are_private(client):
    job=make_order(client)
    as_user('worker')
    items=client.get('/notifications').json()
    assert len(items) == 1 and items[0]['path'] == f'/orders/{job}'
    ident=items[0]['id']
    as_user('other')
    assert client.get('/notifications').json() == []
    assert client.post(f'/notifications/{ident}/read').status_code == 403
    as_user('worker')
    assert client.post(f'/notifications/{ident}/read').status_code == 200
    assert client.get('/notifications').json()[0]['read'] is True


def test_photo_validation_and_user_isolation(client):
    import base64
    from io import BytesIO
    from PIL import Image
    assert client.post('/profile/photo',json={'target':'avatar','data':'not-an-image'}).status_code == 400
    buffer=BytesIO()
    Image.new('RGB',(10,10)).save(buffer,format='PNG')
    data=base64.b64encode(buffer.getvalue()).decode()
    assert client.post('/profile/photo',json={'target':'avatar','data':data}).status_code == 200
    assert client.get('/profile').json()['avatar'].startswith('data:image/jpeg;base64,')
    for _ in range(4):
        assert client.post('/profile/photo',json={'target':'portfolio','data':data}).status_code == 200
    assert client.post('/profile/photo',json={'target':'portfolio','data':data}).status_code == 400
    as_user('other')
    assert not client.get('/profile').json().get('avatar')


def test_refund_webhook_adjusts_earnings_once(client,monkeypatch):
    job=make_order(client)
    as_user('worker')
    client.post(f'/orders/{job}/complete')
    api.db().collection('orders').document(job).update({'paymentStatus':'paid','paymentId':'pay_123',
      'razorpayOrderId':'order_123','paidAt':api.now()})
    payment={'id':'pay_123','order_id':'order_123','amount':60000,'currency':'INR','amount_refunded':10000}
    monkeypatch.setattr(api,'razorpay',lambda *args:payment)
    monkeypatch.setenv('RAZORPAY_WEBHOOK_SECRET','secret')
    body=json.dumps({'event':'refund.processed','payload':{'refund':{'entity':{'payment_id':'pay_123'}}}}).encode()
    signature=hmac.new(b'secret',body,hashlib.sha256).hexdigest()
    for _ in range(2):
        assert client.post('/payments/webhook',content=body,headers={'x-razorpay-signature':signature}).status_code == 200
    assert client.get('/earnings').json()['total'] == 500
    assert client.get('/earnings').json()['pending'] == 0


def test_direct_upi_claim_requires_worker_confirmation(client):
    job = make_order(client)
    as_user('worker')
    profile = client.get('/profile').json()
    editable = {key: profile.get(key) for key in ('name','phone','location','language','skills','work_type','travel_distance','available_time','about','goal','coordinates')}
    editable['upi_id'] = 'worker@upi'
    assert client.patch('/profile', json=editable).status_code == 200
    assert client.post(f'/orders/{job}/complete').status_code == 200

    as_user('customer')
    upi = client.get(f'/orders/{job}/upi')
    assert upi.status_code == 200
    assert upi.json()['upiId'] == 'worker@upi'
    assert upi.json()['qr'].startswith('data:image/png;base64,')
    assert client.post(f'/orders/{job}/payment-claim', json={'method':'upi','reference':'1'}).status_code == 400
    assert client.post(f'/orders/{job}/payment-claim', json={'method':'upi','reference':'123456789012'}).status_code == 200

    as_user('worker')
    assert client.get(f'/orders/{job}').json()['paymentStatus'] == 'awaiting_confirmation'
    assert client.get('/earnings').json()['total'] == 0
    assert client.post(f'/orders/{job}/payment-confirm').status_code == 200
    assert client.get('/earnings').json()['total'] == 600


def test_customer_can_cancel_open_job_and_close_applications(client):
    client.patch('/profile', json={'name':'Worker','location':'Area','skills':['Cooking']})
    switch_mode(client, 'customer', 'customer')
    job = client.post('/opportunities', json=dict(title='Cook dinner', category='Cooking', amountPaise=50000,
        location='Area', address='Private address', phone='1234567890', date='2026-12-01', time='Evening')).json()['id']
    as_user('worker')
    assert client.post(f'/opportunities/{job}/apply').status_code == 200
    as_user('customer')
    assert client.post(f'/opportunities/{job}/cancel').status_code == 200
    as_user('worker')
    assert client.get('/applications').json()[0]['status'] == 'Closed'
