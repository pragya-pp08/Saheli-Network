import React, { useState } from 'react'
import {
  MapPin, Phone, Globe, Home, Bike, Clock,
  Pencil, ChevronRight, Camera, Plus, LogOut, Star
} from 'lucide-react'

const skills = ['Tailoring', 'Mehndi', 'Cooking', 'Tuition', 'Stitching', 'Beautician']
const activeSkills = ['Tailoring', 'Mehndi', 'Cooking']

const reviews = [
  { name: 'Priya S.',  rating: 5, text: 'Bahut accha kaam kiya. Mehndi ekdum sahi thi.', date: '2 din pehle' },
  { name: 'Sunita R.', rating: 5, text: 'Silai ka kaam waqt pe hua aur sundar bhi tha.', date: '1 hafta pehle' },
  { name: 'Kavita M.', rating: 4, text: 'Accha kaam hai, agli baar bhi bulaungi.', date: '2 hafte pehle' },
]

const orders = [
  { name: 'Mehndi – Rani ki Shaadi', date: 'June 24', amt: '₹1,800', done: true },
  { name: 'Blouse Silai – Priya',    date: 'June 28', amt: '₹500',   done: false },
  { name: 'Mehndi – Sunita Event',   date: 'June 29', amt: '₹1,200', done: false },
  { name: 'Salwar Suit – Kavita',    date: 'June 20', amt: '₹700',   done: true },
]

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 px-5 py-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[14px] font-semibold text-gray-800">{title}</p>
      {action}
    </div>
  )
}

function EditLink() {
  return (
    <button className="flex items-center gap-1 text-[12px] text-rose-500 font-medium">
      <Pencil size={11} /> Edit
    </button>
  )
}

function InfoRow({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-rose-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-[13px] font-medium text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function Stars({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i} size={size}
          fill={i <= rating ? '#fbbf24' : '#e5e7eb'}
          className={i <= rating ? 'text-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const [active, setActive] = useState(activeSkills)

  const toggle = (s) =>
    setActive(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2]">
      <div className="max-w-[600px] flex flex-col gap-4">

        {/* Header */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center text-white text-2xl font-semibold">
                S
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white">
                <Camera size={10} className="text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[17px] font-bold text-gray-900">Shanti Devi</p>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-[12px] text-gray-400 mt-1 flex items-center gap-1">
                <MapPin size={10} /> Rampur, Madhya Pradesh
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Stars rating={5} />
                <span className="text-[12px] text-gray-500">4.8 · 34 reviews</span>
              </div>
            </div>
            <EditLink />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
            {[
              { label: 'Kaam Kiye', value: '128' },
              { label: 'Is Mahine', value: '₹12,450' },
              { label: 'Rating',    value: '4.8/5' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[15px] font-bold text-gray-900">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Details */}
        <Card>
          <SectionHead title="Meri Jaankari" action={<EditLink />} />
          <InfoRow Icon={Phone}  label="Phone Number"   value="+91 98765 43210" />
          <InfoRow Icon={Globe}  label="Pasand ki Bhasha" value="Hindi" />
          <InfoRow Icon={MapPin} label="Gaon / Jagah"   value="Rampur, Madhya Pradesh" />
        </Card>

        {/* Skills */}
        <Card>
          <SectionHead title="Meri Skills" action={
            <button className="flex items-center gap-1 text-[12px] text-rose-500 font-medium">
              <Plus size={11} /> Add
            </button>
          } />
          <div className="flex flex-wrap gap-2">
            {skills.map(s => {
              const on = active.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    on
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3">Pink wali skills clients ko dikhti hain</p>
        </Card>

        {/* Work Preferences */}
        <Card>
          <SectionHead title="Kaam ki Pasand" action={<EditLink />} />
          <InfoRow Icon={Home}  label="Kaam Kahan"       value="Ghar se" />
          <InfoRow Icon={Bike}  label="Kitni Door Jaana" value="5 km tak" />
          <InfoRow Icon={Clock} label="Kab Available"    value="Subah 9 – Shaam 6" />
        </Card>

        {/* About Me */}
        <Card>
          <SectionHead title="Mere Baare Mein" action={<EditLink />} />
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Mujhe 8 saal ka anubhav hai silai aur mehndi mein. Maine apne gaon ki bahut saari shadiyon mein kaam kiya hai. Ghar par rehke kaam karti hoon aur quality ka poora dhyan rakhti hoon.
          </p>
        </Card>

        {/* Ratings */}
        <Card>
          <SectionHead title="Ratings aur Reviews" />
          <div className="flex items-center gap-5 pb-4 border-b border-gray-50 mb-4">
            <div className="text-center">
              <p className="text-[38px] font-bold text-gray-900 leading-none">4.8</p>
              <Stars rating={5} size={13} />
              <p className="text-[11px] text-gray-400 mt-1">34 reviews</p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {[5,4,3,2,1].map(n => {
                const w = n===5?70:n===4?20:n===3?7:n===2?2:1
                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 w-2">{n}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {reviews.map((r, i) => (
              <div key={i} className="bg-[#FAF7F2] rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 text-[11px] font-semibold">
                      {r.name[0]}
                    </div>
                    <span className="text-[12px] font-semibold text-gray-800">{r.name}</span>
                    <Stars rating={r.rating} size={10} />
                  </div>
                  <span className="text-[11px] text-gray-400">{r.date}</span>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Portfolio */}
        <Card>
          <SectionHead title="Mera Kaam (Photos)" action={
            <button className="flex items-center gap-1 text-[12px] text-rose-500 font-medium">
              <Plus size={11} /> Photo Add Karo
            </button>
          } />
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Bridal Mehndi', bg: 'bg-rose-100' },
              { label: 'Lehenga',       bg: 'bg-purple-100' },
              { label: 'Party Blouse',  bg: 'bg-amber-100' },
            ].map((p, i) => (
              <div key={i} className={`${p.bg} rounded-xl aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer`}>
                <Camera size={18} className="text-gray-400" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/15 px-1.5 py-1">
                  <p className="text-[9px] text-white font-medium">{p.label}</p>
                </div>
              </div>
            ))}
            <div className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-rose-200 transition-colors">
              <Plus size={16} className="text-gray-300" />
              <p className="text-[10px] text-gray-400">Add</p>
            </div>
          </div>
        </Card>

        {/* My Work */}
        <Card>
          <SectionHead title="Mera Kaam" />
          {orders.map((o, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${o.done ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 truncate">{o.name}</p>
                <p className="text-[11px] text-gray-400">{o.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-semibold text-gray-700">{o.amt}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  o.done ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {o.done ? 'Ho Gaya' : 'Chal Raha Hai'}
                </span>
              </div>
            </div>
          ))}
        </Card>

        {/* Earnings */}
        <Card>
          <SectionHead title="Meri Kamai" />
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { m: 'April', v: '₹9,200',  curr: false },
              { m: 'May',   v: '₹11,050', curr: false },
              { m: 'June',  v: '₹12,450', curr: true  },
            ].map(m => (
              <div key={m.m} className={`rounded-xl p-3 text-center ${m.curr ? 'bg-[#E8F5ED] border border-green-100' : 'bg-[#FAF7F2]'}`}>
                <p className="text-[13px] font-bold text-gray-800">{m.v}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{m.m}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#FAF7F2] rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-[13px] text-gray-600">Is saal ki puri kamai</span>
            <span className="text-[15px] font-bold text-gray-900">₹32,700</span>
          </div>
        </Card>

        {/* Settings */}
        <Card>
          <SectionHead title="Settings" />
          {[
            { Icon: Pencil, label: 'Profile Edit Karo',  sub: 'Apni jaankari badlo',   bg: 'bg-rose-50',   col: 'text-rose-400',   danger: false },
            { Icon: Globe,  label: 'Bhasha Badlo',       sub: 'Hindi ya English',       bg: 'bg-purple-50', col: 'text-purple-400', danger: false },
            { Icon: LogOut, label: 'Logout',             sub: 'Account se bahar jao',   bg: 'bg-gray-50',   col: 'text-gray-400',   danger: true  },
          ].map(({ Icon, label, sub, bg, col, danger }) => (
            <button key={label} className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors text-left">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={col} />
              </div>
              <div className="flex-1">
                <p className={`text-[13px] font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </Card>

        <div className="h-4" />
      </div>
    </div>
  )
}
