import React, { useEffect, useState } from 'react';
import { api, post } from '../services/api';
import EditForm from './EditForm';
import { useLanguage } from '../i18n/LanguageContext';

const categories = ['Mehndi','Tailoring','Cooking','Tuition','Beautician','Cleaning','Babysitting'];
export default function CustomerJobs({ onChanged = () => {}, expanded = false }) {
  const { t } = useLanguage();
  const fields = [
    {name:'title',label:t('jobName'),required:true,maxLength:120}, {name:'category',label:t('skill'),options:categories},
    {name:'pay',label:t('amount'),type:'number',min:1,max:100000,step:'0.01',required:true},
    {name:'location',label:t('visibleArea'),required:true,maxLength:200}, {name:'address',label:t('fullAddress'),required:true,maxLength:300},
    {name:'phone',label:t('contactPhone'),required:true,maxLength:25}, {name:'date',label:t('date'),type:'date',required:true},
    {name:'time',label:t('availability'),required:true,maxLength:100}, {name:'description',label:t('workDetails')},
    {name:'urgency',label:t('urgentQuestion'),options:[t('no'),t('yes')]},
  ];
  const [creating, setCreating] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    setError(''); setBusy(true);
    try { setJobs(await api('/my-jobs')); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  useEffect(() => {
    if (expanded) load();
  }, [expanded]);

  return <>
    <div className="flex gap-2">
      <button onClick={() => setCreating(true)} className="bg-rose-500 text-white px-3 py-2 rounded-xl text-xs">+ {t('postJob')}</button>
      {!expanded && <button disabled={busy} onClick={() => jobs ? setJobs(null) : load()} className="border border-gray-200 bg-white px-3 py-2 rounded-xl text-xs text-gray-500">{t('myPostedJobs')}</button>}
    </div>
    {creating && <EditForm title={t('postWork')} fields={fields} initial={{category:'Mehndi',urgency:t('no')}} location onClose={() => setCreating(false)} onSave={async v => {
      const {pay,urgency,...rest} = v;
      await post('/opportunities', {...rest,amountPaise:Math.round(Number(pay)*100),urgent:urgency===t('yes')});
      await load(); onChanged();
    }} />}
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    {jobs && <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
      <h2 className="font-semibold">{t('myPostedJobs')}</h2>
      {jobs.length === 0 && <p className="text-sm text-gray-400">Abhi koi kaam post nahi kiya hai.</p>}
      {jobs.map(job => <div key={job.id} className="border-b border-gray-100 pb-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">{job.title} · {job.status}</p>
          {job.status === 'open' && <button disabled={busy} className="text-xs text-red-500" onClick={async () => {
            setBusy(true); setError('');
            try { await post(`/opportunities/${job.id}/cancel`); await load(); onChanged(); }
            catch (err) { setError(err.message); } finally { setBusy(false); }
          }}>{t('cancelJob')}</button>}
        </div>
        {!job.applications.length && <p className="text-gray-400">{t('waitingApplications')}</p>}
        {job.applications.map(a => <div key={a.id} className="flex items-center justify-between mt-2">
          <span>{a.name} · {a.skills.join(', ')}</span>
          <button disabled={busy || job.status !== 'open'} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg disabled:text-gray-400" onClick={async () => {
            setBusy(true); setError('');
            try { await post(`/applications/${a.id}/accept`); await load(); onChanged(); }
            catch (err) { setError(err.message); } finally { setBusy(false); }
          }}>{a.status === 'Accepted' ? 'Selected' : job.status !== 'open' ? 'Closed' : t('selectWorker')}</button>
        </div>)}
      </div>)}
    </div>}
  </>;
}
