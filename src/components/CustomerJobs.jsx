import React, { useEffect, useState } from 'react';
import { api, post } from '../services/api';
import EditForm from './EditForm';

const categories = ['Mehndi','Tailoring','Cooking','Tuition','Beautician','Cleaning','Babysitting'];
const fields = [
  {name:'title',label:'Kaam ka naam',required:true,maxLength:120},
  {name:'category',label:'Skill',options:categories},
  {name:'pay',label:'Payment (₹)',type:'number',min:1,max:100000,step:'0.01',required:true},
  {name:'location',label:'Gaon / Area (visible to workers)',required:true,maxLength:200},
  {name:'address',label:'Full address (only selected worker)',required:true,maxLength:300},
  {name:'phone',label:'Phone (only selected worker)',required:true,maxLength:25},
  {name:'date',label:'Date',type:'date',required:true},
  {name:'time',label:'Time / Availability',required:true,maxLength:100},
  {name:'description',label:'Work details'},
  {name:'urgency',label:'Urgent?',options:['No','Yes']},
];

export default function CustomerJobs({ onChanged = () => {}, expanded = false }) {
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
      <button onClick={() => setCreating(true)} className="bg-rose-500 text-white px-3 py-2 rounded-xl text-xs">+ Kaam Post Karo</button>
      {!expanded && <button disabled={busy} onClick={() => jobs ? setJobs(null) : load()} className="border border-gray-200 bg-white px-3 py-2 rounded-xl text-xs text-gray-500">Mere Posted Jobs</button>}
    </div>
    {creating && <EditForm title="Kaam Post Karo" fields={fields} initial={{category:'Mehndi',urgency:'No'}} location onClose={() => setCreating(false)} onSave={async v => {
      const {pay,urgency,...rest} = v;
      await post('/opportunities', {...rest,amountPaise:Math.round(Number(pay)*100),urgent:urgency==='Yes'});
      await load(); onChanged();
    }} />}
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    {jobs && <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
      <h2 className="font-semibold">Mere Posted Jobs</h2>
      {jobs.length === 0 && <p className="text-sm text-gray-400">Abhi koi kaam post nahi kiya hai.</p>}
      {jobs.map(job => <div key={job.id} className="border-b border-gray-100 pb-3 text-sm">
        <p className="font-medium">{job.title} · {job.status}</p>
        {!job.applications.length && <p className="text-gray-400">Applications ka intezaar hai.</p>}
        {job.applications.map(a => <div key={a.id} className="flex items-center justify-between mt-2">
          <span>{a.name} · {a.skills.join(', ')}</span>
          <button disabled={busy || job.status !== 'open'} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg disabled:text-gray-400" onClick={async () => {
            setBusy(true); setError('');
            try { await post(`/applications/${a.id}/accept`); await load(); onChanged(); }
            catch (err) { setError(err.message); } finally { setBusy(false); }
          }}>{a.status === 'Accepted' ? 'Selected' : job.status !== 'open' ? 'Closed' : 'Select Worker'}</button>
        </div>)}
      </div>)}
    </div>}
  </>;
}
