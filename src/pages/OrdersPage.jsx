import React, { useState } from 'react'
import { MapPin, Clock } from 'lucide-react'

const orders = [
  { id:1, title:'Mehndi – Rani ki Shaadi',   client:'Rani Devi',   dist:'0.5 km', date:'June 24', pay:'₹1,800', status:'done'    },
  { id:2, title:'Blouse Silai – Priya',       client:'Priya Singh', dist:'1.2 km', date:'June 28', pay:'₹600',   status:'ongoing' },
  { id:3, title:'Mehndi – Sunita ka Event',   client:'Sunita Bai',  dist:'2 km',   date:'June 29', pay:'₹1,200', status:'ongoing' },
  { id:4, title:'Salwar Suit – Kavita',        client:'Kavita Rao',  dist:'0.8 km', date:'June 20', pay:'₹700',   status:'done'    },
  { id:5, title:'Party Mehndi – Geeta',        client:'Geeta Devi',  dist:'3 km',   date:'June 18', pay:'₹900',   status:'done'    },
  { id:6, title:'Lehenga Silai – Ritu',        client:'Ritu Sharma', dist:'1 km',   date:'July 2',  pay:'₹1,500', status:'pending' },
]

const tabs = ['Sab', 'Chal Raha', 'Ho Gaya', 'Pending']

const statusMap = {
  ongoing: 'Chal Raha',
  done:    'Ho Gaya',
  pending: 'Pending',
}

const statusStyle = {
  ongoing: 'bg-amber-50 text-amber-600',
  done:    'bg-emerald-50 text-emerald-600',
  pending: 'bg-gray-100 text-gray-500',
}

const dotStyle = {
  ongoing: 'bg-amber-400',
  done:    'bg-emerald-400',
  pending: 'bg-gray-300',
}

export default function OrdersPage() {
  const [tab, setTab] = useState('Sab')

  const filtered = orders.filter(o => {
    if (tab === 'Sab') return true
    if (tab === 'Chal Raha') return o.status === 'ongoing'
    if (tab === 'Ho Gaya')   return o.status === 'done'
    if (tab === 'Pending')   return o.status === 'pending'
    return true
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
      <div className="max-w-[650px] flex flex-col gap-4">

        <div>
          <p className="text-[18px] font-bold text-gray-900">Mere Orders</p>
          <p className="text-[13px] text-gray-400 mt-0.5">Aapke sab kaam yahan hain</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:'Ho Gaye', value:'12', color:'text-emerald-600', bg:'bg-[#E8F5ED] border-green-100' },
            { label:'Chal Rahe', value:'2',  color:'text-amber-600',   bg:'bg-amber-50 border-amber-100' },
            { label:'Pending', value:'1',  color:'text-gray-600',    bg:'bg-white border-gray-100' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border px-4 py-4 text-center ${s.bg}`}>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
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

        {/* Order list */}
        <div className="flex flex-col gap-2.5">
          {filtered.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotStyle[o.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{o.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <MapPin size={9} /> {o.dist}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={9} /> {o.date}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[14px] font-bold text-gray-900">{o.pay}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[o.status]}`}>
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
