import React, { useEffect, useRef, useState } from 'react';

// Uses the existing card, input and button styling; only appears after an action.
export default function EditForm({ title, fields, initial, onSave, onClose, location = false }) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    return () => previous?.focus();
  }, []);
  async function locate() {
    setError('');
    if (!navigator.geolocation) { setError('Location is not supported. Please enter your area.'); return; }
    navigator.geolocation.getCurrentPosition(p => setValues(v => ({ ...v, coordinates: { lat: p.coords.latitude, lng: p.coords.longitude } })),
      () => setError('Location could not be read. You can enter your area manually.'), { timeout: 15000, enableHighAccuracy: true });
  }
  return <dialog ref={dialog} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} className="bg-white rounded-2xl p-6 w-[480px] max-w-[95vw] max-h-[90vh] backdrop:bg-black/40">
    <form onSubmit={async e => {
      e.preventDefault(); setBusy(true); setError('');
      try { await onSave(values); onClose(); } catch (err) { setError(err.message); } finally { setBusy(false); }
    }} aria-label={title}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <fieldset disabled={busy} className="space-y-3">
        {fields.map(f => <label key={f.name} className="block text-sm text-gray-700">
          {f.label}
          {f.options ? <select className="w-full border rounded-xl p-3 mt-1" value={values[f.name] ?? ''} onChange={e => setValues({ ...values, [f.name]: e.target.value })} required={f.required}>
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select> : <input className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-rose-200" type={f.type || 'text'} required={f.required} min={f.min} max={f.max} step={f.step} maxLength={f.maxLength || 2000} value={values[f.name] ?? ''} onChange={e => setValues({ ...values, [f.name]: e.target.value })} />}
        </label>)}
        {location && <button type="button" onClick={locate} className="text-sm text-rose-500">{values.coordinates ? '✓ GPS location saved in this form' : 'Use my current location'}</button>}
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-500 mt-3">{error}</p>}
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" disabled={busy} onClick={onClose} className="border px-4 py-2 rounded-lg">Cancel</button>
        <button disabled={busy} className="bg-rose-500 text-white px-5 py-2 rounded-lg">{busy ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  </dialog>;
}
