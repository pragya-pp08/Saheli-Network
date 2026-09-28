import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Filter, Navigation } from 'lucide-react'

import { api, post } from '../services/api'
import { useLanguage } from '../i18n/LanguageContext'

const cats = ['Sab', 'Mehndi', 'Tailoring', 'Cooking', 'Tuition', 'Beautician']

export default function OpportunitiesPage() {
  const { t } = useLanguage()
  const [active, setActive] = useState('Sab')
  const [all, setAll] = useState([])

  const [selectedJob, setSelectedJob] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState([])

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [success, setSuccess] = useState('');
  async function load() {
    setError('');
    try { const [jobs, applications] = await Promise.all([api('/opportunities'), api('/applications')]); setAll(jobs); setAppliedJobs(applications.map(a => a.jobId)); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = all.filter(o => (active === 'Sab' || o.category === active) && (!nearbyOnly || (o.distance !== null && o.distance <= 5)))

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[18px] font-bold text-gray-900">{t('workOpportunities')}</p>
            <p className="text-[13px] text-gray-400 mt-0.5">{t('availableWork', { count: all.length })}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNearbyOnly(!nearbyOnly)}
            className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 bg-white px-3 py-2 rounded-xl"
          >
            <Filter size={13} /> {t('within5')}{nearbyOnly ? " ✓" : ""}
          </motion.button>
        </div>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {success && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}
        {loading && <p className="text-sm text-gray-400">Loading opportunities...</p>}
        {!loading && !error && !filtered.length && (
          <p className="text-sm text-gray-400">
            {t('noCategoryWork')}
          </p>
        )}
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(c)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                active === c
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {filtered.map(o => (
            <motion.div
              key={o.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white rounded-2xl border px-4 py-4 flex flex-col gap-3 ${
                o.urgent ? 'border-l-[3px] border-l-amber-400 border-t-gray-100 border-r-gray-100 border-b-gray-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-gray-900 leading-tight">{o.title}</p>
                {o.isOwn ? (
                  <span className="text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    {t('ownPostedJob')}
                  </span>
                ) : o.urgent && (
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    {t('urgent')}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin size={10} /> {o.dist}
                </p>
                {o.gpsAvailable && <p className="text-[11px] font-medium text-green-600">● GPS location available after selection</p>}
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {o.time}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                <p className="text-[14px] font-bold text-gray-900">{o.pay}</p>
                <motion.button
                  whileHover={{ scale: appliedJobs.includes(o.id) || o.isOwn ? 1 : 1.05 }}
                  whileTap={{ scale: appliedJobs.includes(o.id) || o.isOwn ? 1 : 0.95 }}
                  onClick={() => setSelectedJob(o)}
                  disabled={appliedJobs.includes(o.id) || o.isOwn}
                  title={o.isOwn ? t('ownJobHelp') : undefined}
                  className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    o.isOwn
                      ? "bg-purple-100 text-purple-600 cursor-default"
                      : appliedJobs.includes(o.id)
                      ? "bg-green-500 text-white cursor-default"
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  }`}
                >
                  {o.isOwn ? t('yourJob') : appliedJobs.includes(o.id) ? `✓ ${t('applied')}` : t('apply')}
                </motion.button>
              </div>
              <button
                type="button"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.location)}`, '_blank', 'noopener,noreferrer')}
                className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-blue-600 hover:text-blue-700"
              >
                <Navigation size={11} /> View area on Google Maps
              </button>
              {o.isOwn && <p className="text-[11px] text-purple-600">This is your own post. Sign in with another Saheli account to apply.</p>}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl p-6 w-[420px]"
              >
                <h2 className="text-xl font-bold mb-4">
                  {t('applyTitle')}
                </h2>

                <div className="space-y-2 text-sm">
                  <p><strong>{t('service')}:</strong> {selectedJob.title}</p>
                  <p><strong>{t('distance')}:</strong> {selectedJob.dist}</p>
                  <p><strong>{t('payment')}:</strong> {selectedJob.pay}</p>
                  <p><strong>{t('time')}:</strong> {selectedJob.time}</p>
                  <p><strong>{t('availability')}:</strong> {selectedJob.available_time}</p>
                </div>
                {applyError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{applyError}</p>}

                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedJob(null); setApplyError(''); }}
                    className="border px-4 py-2 rounded-lg"
                  >
                    {t('cancel')}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true); setApplyError('');
                      try {
                        await post('/opportunities/' + selectedJob.id + '/apply');
                        setAppliedJobs(prev => [...prev, selectedJob.id]);
                        setSuccess(`Application sent for ${selectedJob.title}. You can track it in Orders.`);
                        setSelectedJob(null);
                      }
                      catch (err) { setApplyError(err.message); } finally { setBusy(false); }
                    }}
                    className="bg-rose-500 text-white px-5 py-2 rounded-lg"
                  >
                    {t('applyNow')}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
