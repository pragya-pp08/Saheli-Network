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

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data));
  }, [id]);

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-[#FAF7F2]">

      <div className="max-w-4xl mx-auto">

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

          {/* Buttons */}

          <div className="grid grid-cols-3 gap-4 mt-10">

            <button
              onClick={() => window.open(`tel:${order.phone}`)}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
               Call Customer
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/${order.address}`,
                  "_blank"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
               Navigate
            </button>

            <button
              onClick={() => setCompleted(true)}
              disabled={completed}
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