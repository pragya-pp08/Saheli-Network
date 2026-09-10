import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, post } from '../services/api';

export default function Notifications({ onClose }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    let cancelled = false;
    api('/notifications').then(data => { if (!cancelled) setItems(data); }).catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; previous?.focus(); };
  }, []);
  return <dialog aria-label="Notifications" ref={ref} onCancel={e => { e.preventDefault(); onClose(); }} className="bg-white rounded-2xl p-6 w-[420px] max-w-[95vw] max-h-[80vh] backdrop:bg-black/40">
    <div className="flex justify-between mb-4"><h2 className="font-bold">Notifications</h2><button onClick={onClose}>Close</button></div>
    {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
    {!items && !error && <p className="text-gray-400 text-sm">Loading...</p>}
    {items?.length === 0 && <p className="text-gray-400 text-sm">Abhi koi naya update nahi hai.</p>}
    {items?.map(item => <button key={item.id} className={`w-full text-left border-b py-3 text-sm ${item.read ? 'text-gray-500' : 'text-rose-600 font-medium'}`} onClick={async () => {
      try { await post(`/notifications/${item.id}/read`); navigate(item.path); onClose(); } catch (err) { setError(err.message); }
    }}>{item.text}</button>)}
  </dialog>;
}
