import React, { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

const monthly = [
  { m: 'January', v: 7200 },
  { m: 'February', v: 8100 },
  { m: 'March', v: 9400 },
  { m: 'April', v: 9200 },
  { m: 'May', v: 11050 },
  { m: 'June', v: 12450, curr: true },
]

export default function EarningsPage() {
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('http://localhost:8000/earnings')
        const data = await response.json()
        setEarnings(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load earnings.')
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading your earnings...
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

  const total = monthly.reduce((sum, item) => sum + item.v, 0)
  const maxVal = Math.max(...monthly.map(item => item.v))
  const goal = earnings.goal || 15000
  const goalPct = Math.min((earnings.month / goal) * 100, 100)

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        <div>
          <p className="text-[18px] font-bold text-gray-900">Meri Kamai</p>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Is saal ka pura hisaab
          </p>
        </div>

        {/* Hero */}
        <div className="bg-[#E8F5ED] border border-green-100 rounded-2xl px-6 py-5">
          <p className="text-[12px] font-medium text-green-700 uppercase tracking-wide mb-1">
            Is Mahine
          </p>

          <p className="text-[36px] font-bold text-green-900 leading-none">
            ₹{earnings.month.toLocaleString('en-IN')}
          </p>

          <div className="flex items-center gap-1.5 mt-2">
            <TrendingUp size={13} className="text-green-600" />
            <p className="text-[12px] text-green-700">
              Great work! Aapki kamai lagataar badh rahi hai.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-green-200 grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[11px] text-green-700">Aaj</p>
              <p className="font-bold text-green-900">
                ₹{earnings.today.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-green-700">Is Hafte</p>
              <p className="font-bold text-green-900">
                ₹{earnings.week.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-green-700">Pending</p>
              <p className="font-bold text-orange-600">
                ₹{(earnings.pending || 0).toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-green-700">Is Saal</p>
              <p className="font-bold text-green-900">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Goal Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between mb-3">
            <p className="font-semibold">
              Monthly Goal
            </p>

            <p className="text-sm text-gray-500">
              ₹{earnings.month.toLocaleString('en-IN')} / ₹{goal.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-700"
              style={{
                width: `${goalPct}%`
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5 hover:shadow-md transition-all duration-200">
          <p className="text-[14px] font-semibold text-gray-800 mb-4">
            Mahine ke hisaab se
          </p>

          <div className="flex items-end gap-2 h-32">
            {monthly.map(item => {
              const pct = (item.v / maxVal) * 100

              return (
                <div
                  key={item.m}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <p className="text-[10px] font-medium text-gray-500">
                    ₹{(item.v / 1000).toFixed(1)}k
                  </p>

                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-t-lg ${
                        item.curr ? 'bg-rose-400' : 'bg-rose-100'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>

                  <p className="text-[9px] text-gray-400">
                    {item.m.slice(0, 3)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5 hover:shadow-md transition-all duration-200">
          <p className="text-[14px] font-semibold text-gray-800 mb-3">
            Haal ke Kaam
          </p>

          {earnings.history.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-rose-300" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">
                  {item.title}
                </p>

                <p className="text-[11px] text-gray-500">
                  {item.customer}
                </p>

                <p className="text-[11px] text-gray-400">
                  {item.date}
                </p>
              </div>

              <p className="text-[14px] font-bold text-gray-900">
                {item.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Withdraw Earnings */}
        <button
          onClick={() => alert('Withdrawal request submitted successfully!')}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Withdraw Earnings
        </button>

        {/* Tips */}
        <div className="bg-[#F0E6FF] border border-purple-100 rounded-2xl px-5 py-4">
          <p className="text-[13px] font-semibold text-purple-800 mb-1">
            Kamai badhane ka tarika
          </p>

          <p className="text-[12px] text-purple-700 leading-relaxed">
            Wedding season mein Mehndi aur Silai ki demand sabse zyada hoti
            hai. Profile mein naye photos add karne se aur achhi ratings se
            zyada clients mil sakte hain.
          </p>
        </div>

      </div>
    </div>
  )
}