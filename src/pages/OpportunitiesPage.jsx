import React, { useState,useEffect} from 'react'
import { MapPin, Clock, Filter } from 'lucide-react'

const cats = ['Sab', 'Mehndi', 'Tailoring', 'Cooking', 'Tuition', 'Beautician']

export default function OpportunitiesPage() {
  const [active, setActive] = useState('Sab')
  const [all, setAll] = useState([])
  useEffect(() => {
    fetch("http://localhost:8000/opportunities")
      .then(res => res.json())
      .then(data => setAll(data))
  }, [])

  const filtered = active === 'Sab' ? all : all.filter(o => o.category === active)

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
      <div className="max-w-[700px] flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[18px] font-bold text-gray-900">Kaam ke Mauke</p>
            <p className="text-[13px] text-gray-400 mt-0.5">Aaj {all.length} kaam available hain aapke aas-paas</p>
          </div>
          <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 bg-white px-3 py-2 rounded-xl">
            <Filter size={13} /> Filter
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                active === c
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(o => (
            <div
              key={o.id}
              className={`bg-white rounded-2xl border px-4 py-4 flex flex-col gap-3 ${
                o.urgent ? 'border-l-[3px] border-l-amber-400 border-t-gray-100 border-r-gray-100 border-b-gray-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-gray-900 leading-tight">{o.title}</p>
                {o.urgent && (
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    Jaldi
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin size={10} /> {o.dist} door
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {o.time}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                <p className="text-[14px] font-bold text-gray-900">{o.pay}</p>
                <button className="text-[12px] font-medium text-white bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors">
                  Apply Karo
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
