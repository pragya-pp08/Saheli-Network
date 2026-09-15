import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";

import { api, post } from "../services/api";
import EditForm from "../components/EditForm";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upi, setUpi] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentError, setPaymentError] = useState("");

  async function load() {
    const data = await api('/orders/' + id); setOrder(data); setCompleted(data.status === 'Completed');
  }
  useEffect(() => { setOrder(null); setError(''); load().catch(err => setError(err.message)); }, [id]);
  async function action(fn) { setBusy(true); setError(''); try { await fn(); await load(); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  async function openPayment() {
    setPaymentOpen(true); setPaymentError(''); setUpi(null);
    try { setUpi(await api(`/orders/${id}/upi`)); }
    catch (err) { setPaymentError(err.message); }
  }
  async function submitPaymentClaim() {
    setBusy(true); setPaymentError('');
    try {
      await post(`/orders/${id}/payment-claim`, { method: paymentMethod, reference: paymentMethod === 'upi' ? paymentReference : '' });
      setPaymentOpen(false); await load();
    } catch (err) { setPaymentError(err.message); }
    finally { setBusy(false); }
  }

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        {error || "Loading..."}
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-[#FAF7F2]">

      <div className="max-w-4xl mx-auto">
        {error && <p role="alert" className="text-sm text-red-500 mb-3">{error}</p>}
        {reviewing && <EditForm title="Review" initial={{rating:5,text:""}} fields={[{name:"rating",label:"Rating (1–5)",type:"number",min:1,max:5,required:true},{name:"text",label:"Review",required:true,maxLength:1000}]} onSave={v => post(`/orders/${id}/review`, {...v,rating:Number(v.rating)})} onClose={() => setReviewing(false)} />}
        {paymentOpen && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-[430px] max-w-full max-h-[92vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Payment</h2>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setPaymentMethod('upi')} className={`px-4 py-2 rounded-xl text-sm border ${paymentMethod === 'upi' ? 'bg-rose-50 border-rose-300 text-rose-600' : 'border-gray-200'}`}>UPI / QR</button>
              <button onClick={() => setPaymentMethod('cash')} className={`px-4 py-2 rounded-xl text-sm border ${paymentMethod === 'cash' ? 'bg-rose-50 border-rose-300 text-rose-600' : 'border-gray-200'}`}>Cash</button>
            </div>
            {paymentMethod === 'upi' && <div className="mt-4 text-center">
              {upi && <>
                <img src={upi.qr} alt="UPI payment QR code" className="w-48 h-48 mx-auto border rounded-xl" />
                <p className="font-semibold mt-3">₹{Number(upi.amount).toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">Pay to {upi.payee} · {upi.upiId}</p>
                <a href={upi.uri} className="inline-block mt-3 bg-green-600 text-white px-5 py-2 rounded-xl text-sm">Open UPI App</a>
                <label className="block text-left text-sm mt-4">UPI transaction reference
                  <input value={paymentReference} onChange={e => setPaymentReference(e.target.value)} className="w-full border rounded-xl p-3 mt-1" placeholder="Enter reference after payment" />
                </label>
              </>}
              {!upi && !paymentError && <p className="text-sm text-gray-400">Loading QR...</p>}
            </div>}
            {paymentMethod === 'cash' && <p className="text-sm text-gray-500 mt-4">Give the payment directly to the Saheli. She will confirm it in her account.</p>}
            {paymentError && <p className="text-sm text-red-500 mt-3">{paymentError}</p>}
            <div className="flex justify-end gap-3 mt-5">
              <button disabled={busy} onClick={() => setPaymentOpen(false)} className="border px-4 py-2 rounded-xl">Cancel</button>
              <button disabled={busy || (paymentMethod === 'upi' && !upi)} onClick={submitPaymentClaim} className="bg-rose-500 text-white px-5 py-2 rounded-xl disabled:opacity-50">{busy ? 'Saving...' : paymentMethod === 'upi' ? 'I Have Paid' : 'Cash Given'}</button>
            </div>
          </div>
        </div>}

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-rose-500 font-medium mb-6 hover:text-rose-600"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {/* Card */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                {order.service}
              </h1>

              <p className="text-gray-500 mt-1">
                Order Details
              </p>

            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                completed
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {completed ? "Completed" : order.status}
            </span>

          </div>

          {/* Details */}

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-[#FAF7F2] rounded-xl p-4">
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold mt-1">{order.customer}</p>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{order.phone}</span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{order.address}</span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{order.date}</span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{order.time}</span>
              </div>
            </div>

            <div className="bg-[#E8F5ED] rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700">
                <IndianRupee size={16} />
                <span className="font-bold">{order.amount}</span>
              </div>
            </div>

          </div>

          {/* Description */}

          <div className="mt-8">

            <h2 className="font-semibold text-lg mb-2">
              Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {order.description}
            </p>

          </div>

          <p className="mt-4 text-sm text-gray-500">Payment: {order.paymentStatus === 'paid' ? 'Confirmed · ' + order.paymentId : order.paymentStatus === 'awaiting_confirmation' ? 'Waiting for Saheli confirmation' : 'Not paid'}</p>
          {order.isCustomer && completed && <div className="flex gap-3 mt-4">
            {order.paymentStatus !== 'paid' && order.paymentStatus !== 'awaiting_confirmation' && <button disabled={busy} onClick={openPayment} className="bg-rose-500 text-white px-5 py-2 rounded-xl">Pay Now</button>}
            <button onClick={() => setReviewing(true)} className="border text-rose-500 px-5 py-2 rounded-xl">Add Review</button>
          </div>}
          {!order.isCustomer && order.paymentStatus === 'awaiting_confirmation' && <button disabled={busy} onClick={() => action(() => post(`/orders/${id}/payment-confirm`))} className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl">{busy ? 'Please wait...' : 'Confirm Payment Received'}</button>}
          {/* Buttons */}

          <div className="grid grid-cols-3 gap-4 mt-10">

            <button
              onClick={() => window.open(`tel:${order.phone}`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
               {order.isCustomer ? "Call Saheli" : "Call Customer"}
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`,
                  "_blank"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
               Navigate
            </button>

            <button
              onClick={() => action(() => post(`/orders/${id}/complete`))}
              disabled={completed || busy || order.isCustomer}
              className={`py-3 rounded-xl font-semibold transition ${
                completed
                  ? "bg-green-600 text-white"
                  : "bg-rose-500 hover:bg-rose-600 text-white"
              }`}
            >
              {completed ? (
                <>
                  <BadgeCheck size={18} className="inline mr-2" />
                  Completed
                </>
              ) : (
                "✓ Mark Completed"
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
