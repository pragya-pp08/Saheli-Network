import React from 'react'
import { TrendingUp } from 'lucide-react'

const monthly = [
  { m: 'January',  v: 7200  },
  { m: 'February', v: 8100  },
  { m: 'March',    v: 9400  },
  { m: 'April',    v: 9200  },
  { m: 'May',      v: 11050 },
  { m: 'June',     v: 12450, curr: true },
]

const recent = [
  { title:'Mehndi – Rani ki Shaadi', date:'June 24', amt:'₹1,800' },
  { title:'Silai – Priya',           date:'June 21', amt:'₹600'   },
  { title:'Cooking – Sharma House',  date:'June 18', amt:'₹800'   },
  { title:'Party Mehndi – Geeta',    date:'June 15', amt:'₹900'   },
  { title:'Salwar Suit – Kavita',    date:'June 12', amt:'₹700'   },
]

const maxVal = Math.max(...monthly.map(m => m.v))

export default function EarningsPage() {
  const total = monthly.reduce((s, m) => s + m.v, 0)

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
      <div className="max-w-[650px] flex flex-col gap-4">

        <div>
          <p className="text-[18px] font-bold text-gray-900">Meri Kamai</p>
          <p className="text-[13px] text-gray-400 mt-0.5">Is saal ka pura hisaab</p>
        </div>

        {/* Hero */}
        <div className="bg-[#E8F5ED] border border-green-100 rounded-2xl px-6 py-5">
          <p className="text-[12px] font-medium text-green-700 uppercase tracking-wide mb-1">Is Mahine (June)</p>
          <p className="text-[36px] font-bold text-green-900 leading-none">₹12,450</p>
          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp size={13} className="text-green-600" />
            <p className="text-[12px] text-green-700">Pichle mahine se <span className="font-semibold">₹1,400 zyada</span></p>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200 flex justify-between">
            <div>
              <p className="text-[11px] text-green-700">Aaj ki Kamai</p>
              <p className="text-[16px] font-bold text-green-900">₹1,240</p>
            </div>
            <div>
              <p className="text-[11px] text-green-700">Is Hafte</p>
              <p className="text-[16px] font-bold text-green-900">₹8,450</p>
            </div>
            <div>
              <p className="text-[11px] text-green-700">Is Saal</p>
              <p className="text-[16px] font-bold text-green-900">₹{total.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5">
          <p className="text-[14px] font-semibold text-gray-800 mb-4">Mahine ke hisaab se</p>
          <div className="flex items-end gap-2 h-32">
            {monthly.map(m => {
              const pct = (m.v / maxVal) * 100
              return (
                <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-[10px] font-medium text-gray-500">
                    ₹{(m.v/1000).toFixed(1)}k
                  </p>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${m.curr ? 'bg-rose-400' : 'bg-rose-100'}`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 text-center leading-tight">
                    {m.m.slice(0,3)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5">
          <p className="text-[14px] font-semibold text-gray-800 mb-3">Haal ke Kaam</p>
          {recent.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-rose-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">{r.title}</p>
                <p className="text-[11px] text-gray-400">{r.date}</p>
              </div>
              <p className="text-[14px] font-bold text-gray-900 flex-shrink-0">{r.amt}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-[#F0E6FF] border border-purple-100 rounded-2xl px-5 py-4">
          <p className="text-[13px] font-semibold text-purple-800 mb-1">Kamai badhane ka tarika</p>
          <p className="text-[12px] text-purple-700 leading-relaxed">
            Wedding season mein Mehndi aur Silai ki demand sabse zyada hoti hai. Profile mein apne naye photos add karo — isse zyada clients contact karenge.
          </p>
        </div>

      </div>
    </div>
  )
}
