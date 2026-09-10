"""Pure money and distance calculations, shared by API and tests."""
from datetime import datetime, timedelta, timezone
from math import radians, sin, cos, asin, sqrt

IST = timezone(timedelta(hours=5, minutes=30))


def earnings_summary(orders, goal=10000, now=None):
    now = (now or datetime.now(IST)).astimezone(IST)
    today = now.date()
    week = today - timedelta(days=today.weekday())
    totals = dict(today=0, week=0, month=0, year=0, pending=0, total=0)
    buckets = [0] * 12
    history = []
    for order in orders:
        amount = max(0, order['amountPaise'] - order.get('refundedPaise', 0))
        if order.get('status') == 'Completed' and order.get('paymentStatus') != 'paid':
            totals['pending'] += amount
        if order.get('paymentStatus') != 'paid':
            continue
        paid = datetime.fromisoformat(order['paidAt']).astimezone(IST)
        if paid > now:
            continue
        totals['total'] += amount
        if paid.date() == today:
            totals['today'] += amount
        if week <= paid.date() <= today:
            totals['week'] += amount
        if paid.year == now.year:
            totals['year'] += amount
            buckets[paid.month - 1] += amount
            if paid.month == now.month:
                totals['month'] += amount
        history.append(dict(id=order['id'], title=order['service'], customer=order['customer'],
                            amount=f'₹{amount / 100:,.2f}', date=paid.strftime('%d %b %Y'),
                            paidAt=order['paidAt'], paymentId=order.get('paymentId', '')))
    result = {key: value / 100 for key, value in totals.items()}
    result.update(goal=goal, history=sorted(history, key=lambda x: x['paidAt'], reverse=True),
                  monthly=[dict(m=datetime(now.year, i + 1, 1).strftime('%B'), v=value / 100,
                                curr=i + 1 == now.month) for i, value in enumerate(buckets)])
    return result


def distance_km(a, b):
    lat1, lon1, lat2, lon2 = map(radians, [a['lat'], a['lng'], b['lat'], b['lng']])
    value = sin((lat2 - lat1) / 2) ** 2 + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2) ** 2
    return round(6371 * 2 * asin(sqrt(min(1, value))), 1)
