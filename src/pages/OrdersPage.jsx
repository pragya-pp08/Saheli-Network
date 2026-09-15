import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, ChevronRight } from 'lucide-react'

import { api } from '../services/api'
import { useLanguage } from '../i18n/LanguageContext'

const tabs = ['all', 'ongoing', 'done', 'pending']

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
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [tab, setTab] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const summary = await api('/account-summary')
        const data = await api('/orders')
        const applications = summary.accountMode === 'worker' ? await api('/applications') : []

        const formatted = data.map(order => ({
          id: order.id,
          title: order.service,
          client: order.isCustomer ? (order.worker || 'Selected Saheli') : order.customer,
          dist: order.address || 'Location not added',
          date: order.date,
          pay: order.amount,
          status:
            order.status === 'Completed'
              ? 'done'
              : order.status === 'Upcoming'
              ? 'ongoing'
              : 'pending',
        }))

        setOrders([...formatted, ...applications.filter(a => a.status !== 'Accepted').map(a => ({
          id: a.id, title: a.title + (a.status === 'Closed' ? ' · Application closed' : a.status === 'Withdrawn' ? ' · Withdrawn' : ' · Application'),
          client: a.status === 'Closed' ? 'This job has been assigned' : 'Awaiting customer selection', dist: a.location, date: a.date, pay: a.pay, status:'pending', application:true
        }))])
      } catch (err) {
        setError(err.message || 'Failed to load orders.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filtered = orders.filter(o => {
    if (tab === 'all') return true
    if (tab === 'ongoing') return o.status === 'ongoing'
    if (tab === 'done') return o.status === 'done'
    if (tab === 'pending') return o.status === 'pending'
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
    <div className="flex-1 overflow-y-auto px-10 py-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        <div>
          <p className="text-[18px] font-bold text-gray-900">{t('ordersTitle')}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {t('ordersSubtitle')}
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: t('done'),
              value: filtered.filter(o => o.status === 'done').length,
              color: 'text-emerald-600',
              bg: 'bg-[#E8F5ED] border-green-100',
            },
            {
              label: t('ongoing'),
              value: filtered.filter(o => o.status === 'ongoing').length,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-100',
            },
            {
              label: t('pending'),
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
          {tabs.map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                tab === tabKey
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              {t(tabKey)}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="flex flex-col gap-2.5">
          {filtered.length === 0 && <p className="text-sm text-gray-400">{t('noOrders')}</p>}
          {filtered.map(o => (
            <div
              key={o.id}
              onClick={() => navigate(o.application ? "/opportunities" : `/orders/${o.id}`)}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
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
                  {t(o.status)}
                </span>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-300 ml-3"
              />
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
