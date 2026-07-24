import React, { useState, useEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'

const tabs = ['Sab', 'Chal Raha', 'Ho Gaya', 'Pending']

const statusMap = {
  ongoing: 'Chal Raha',
  done: 'Ho Gaya',
  pending: 'Pending',
}

const statusStyle = {
  ongoing: 'bg-amber-50 text-amber-600',
  done: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-gray-100 text-gray-500',
}

const dotStyle = {
  ongoing: 'bg-amber-400',
  done: 'bg-emerald-400',
  pending: 'bg-gray-300',
}

export default function OrdersPage() {
  const [tab, setTab] = useState('Sab')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/orders')
        const data = await response.json()

        const formatted = data.map(order => ({
          id: order.id,
          title: order.service,
          client: order.customer,
          dist: '-',
          date: order.date,
          pay: order.amount,
          status:
            order.status === 'Completed'
              ? 'done'
              : order.status === 'Upcoming'
              ? 'ongoing'
              : 'pending',
        }))

        setOrders(formatted)
      } catch (err) {
        setError('Failed to load orders.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filtered = orders.filter(o => {
    if (tab === 'Sab') return true
    if (tab === 'Chal Raha') return o.status === 'ongoing'
    if (tab === 'Ho Gaya') return o.status === 'done'
    if (tab === 'Pending') return o.status === 'pending'
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Orders...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
      <div className="max-w-[650px] flex flex-col gap-4">

        <div>
          <p className="text-[18px] font-bold text-gray-900">Mere Orders</p>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Aapke sab kaam yahan hain
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Ho Gaye',
              value: filtered.filter(o => o.status === 'done').length,
              color: 'text-emerald-600',
              bg: 'bg-[#E8F5ED] border-green-100',
            },
            {
              label: 'Chal Rahe',
              value: filtered.filter(o => o.status === 'ongoing').length,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-100',
            },
            {
              label: 'Pending',
              value: filtered.filter(o => o.status === 'pending').length,
              color: 'text-gray-600',
              bg: 'bg-white border-gray-100',
            },
          ].map(s => (
            <div
              key={s.label}
              className={`rounded-2xl border px-4 py-4 text-center ${s.bg}`}
            >
              <p className={`text-[22px] font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                tab === t
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="flex flex-col gap-2.5">
          {filtered.map(o => (
            <div
              key={o.id}
              onClick={() => alert(o.title)}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotStyle[o.status]}`}
              />

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {o.title}
                </p>

                <p className="text-[11px] text-gray-500">
                  {o.client}
                </p>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <MapPin size={9} />
                    {o.dist}
                  </span>

                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={9} />
                    {o.date}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-bold text-gray-900">
                  {o.pay}
                </p>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[o.status]}`}
                >
                  {statusMap[o.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}