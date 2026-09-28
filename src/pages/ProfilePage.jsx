import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Globe,
  Home,
  Bike,
  Clock,
  Pencil,
  ChevronRight,
  Camera,
  Plus,
  LogOut,
  Star,
} from "lucide-react";

import { api, saveProfile } from "../services/api";
import { logoutUser } from "../services/auth";
import { uploadPhoto } from "../services/photo";
import EditForm from "../components/EditForm";
import ModeSwitch from "../components/ModeSwitch";
import { useLanguage } from "../i18n/LanguageContext";

const defaultSkills = [];

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 px-5 py-5 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-[14px] font-semibold text-gray-800">{title}</p>
      {action}
    </div>
  );
}

function EditLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[12px] text-rose-500 font-medium"
    >
      <Pencil size={11} /> Edit
    </button>
  );
}

function InfoRow({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-rose-400" />
      </div>

      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-[13px] font-medium text-gray-800 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

function Stars({ rating, size = 12 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= rating ? "#fbbf24" : "#e5e7eb"}
          className={i <= rating ? "text-amber-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [active, setActive] = useState(defaultSkills);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const photoInput = useRef(null);
  const photoTarget = useRef("portfolio");
  function choosePhoto(target) { photoTarget.current = target; photoInput.current.click(); }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const reviews = profile?.reviewList || [];
  const orders = profile?.orders || [];

  /* ---------------- GET LOGGED-IN USER ---------------- */

  useEffect(() => {
    let cancelled = false;
    api("/profile").then(data => { if (!cancelled) { setProfile(data); setActive(data.skills || []); } })
      .catch(err => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  /* ---------------- SKILLS ---------------- */

  const fields = [
    {name:'name',label:t('name'),required:true,maxLength:100}, {name:'phone',label:t('phone'),maxLength:25},
    {name:'location',label:t('location'),maxLength:200}, {name:'language',label:t('preferredLanguage'),options:['Hindi','English','Hinglish']},
    {name:'skillsText',label:t('mySkills'),maxLength:500}, {name:'work_type',label:t('workPreference'),maxLength:100},
    {name:'travel_distance',label:'Travel distance',maxLength:50}, {name:'available_time',label:'Available time',maxLength:100},
    {name:'about',label:'About you'}, {name:'goal',label:'Monthly earning goal (₹)',type:'number',min:0,max:10000000},
    {name:'upi_id',label:'UPI ID for receiving payments',maxLength:120}
  ];
  async function persist(values) {
    const allowed = Object.fromEntries(fields.filter(f => f.name !== 'skillsText').map(f => [f.name, values[f.name] ?? '']));
    const updated = await saveProfile({...allowed, goal:Number(values.goal ?? 10000), coordinates:values.coordinates || null,
      skills:[...new Set((values.skillsText ?? (values.skills || []).join(',')).split(',').map(s => s.trim()).filter(Boolean))]});
    setProfile(updated); setActive(updated.skills || []);
  }
  async function toggle(skill) {
    if (saving) return;
    setSaving(true); setError('');
    try { await persist({...profile, skills:active.includes(skill) ? active.filter(s => s !== skill) : [...active,skill]}); }
    catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-500">
        Loading Profile...
      </div>
    );
  }

  /* ---------------- NO PROFILE ---------------- */

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error || "Failed to load profile."}
      </div>
    );
  }

  /* ---------------- PROFILE UI ---------------- */

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        {editing && <EditForm title={t('profileEdit')} fields={fields} initial={{...profile, skillsText:(profile.skills || []).join(", ")}} location onSave={persist} onClose={() => setEditing(false)} />}

        <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="Upload photo" onChange={async e => {
          const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
          setSaving(true); setError('');
          try { setProfile(await uploadPhoto(file, photoTarget.current)); } catch (err) { setError(err.message); } finally { setSaving(false); }
        }} />
        {/* Header */}

        <Card>
          <div className="flex items-start gap-4">

            <div className="relative flex-shrink-0">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center text-white text-2xl font-semibold">
                {profile.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover rounded-2xl" /> : profile.name?.charAt(0)?.toUpperCase()}
              </div>

              <button disabled={saving} onClick={() => choosePhoto("avatar")} aria-label="Change profile photo" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center border-2 border-white">
                <Camera size={10} className="text-white" />
              </button>

            </div>

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2 flex-wrap">

                <p className="text-[17px] font-bold text-gray-900">
                  {profile.name}
                </p>

                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  🌸 Saheli Member
                </span>

              </div>

              <p className="text-[12px] text-gray-400 mt-1 flex items-center gap-1">
                <MapPin size={10} />
                {profile.location}
              </p>

              <div className="flex items-center gap-1.5 mt-1.5">
                <Stars rating={Math.round(profile.rating)} />

                <span className="text-[12px] text-gray-500">
                  {profile.rating} · {profile.reviews} reviews
                </span>
              </div>

              <p className="text-[12px] text-emerald-600 font-medium mt-1">
                {profile.jobs_completed || 0} completed jobs
              </p>

            </div>

            <div className="flex flex-col items-end gap-2">
              <EditLink onClick={() => setEditing(true)} />
              <ModeSwitch currentMode={profile.accountMode || "worker"} subtle />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">

            {[
              {
                label: "Kaam Kiye",
                value: profile.jobs_completed,
              },
              {
                label: "Is Mahine",
                value: `₹${profile.month_income}`,
              },
              {
                label: "Rating",
                value: `${profile.rating}/5`,
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[15px] font-bold text-gray-900">
                  {s.value}
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}

          </div>
        </Card>

        {/* Profile Details */}

        <Card>

          <SectionHead
            title={t('myInfo')}
            action={<EditLink onClick={() => setEditing(true)} />}
          />

          <InfoRow
            Icon={Phone}
            label={t('phone')}
            value={profile.phone}
          />

          <InfoRow
            Icon={Globe}
            label={t('preferredLanguage')}
            value={profile.language}
          />

          <InfoRow
            Icon={MapPin}
            label={t('location')}
            value={profile.location}
          />

        </Card>

        {/* Skills */}

        <Card>

          <SectionHead
            title={t('mySkills')}
            action={
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-[12px] text-rose-500 font-medium"
              >
                <Plus size={11} /> {t('add')}
              </button>
            }
          />

          <div className="flex flex-wrap gap-2">

            {(profile.skills || []).map((s) => {

              const on = active.includes(s);

              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    on
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  {s}
                </button>
              );

            })}

          </div>

          <p className="text-[11px] text-gray-400 mt-3">
            Pink wali skills clients ko dikhti hain
          </p>

        </Card>

        {/* Work Preferences */}

        <Card>

          <SectionHead
            title={t('workPreference')}
            action={<EditLink onClick={() => setEditing(true)} />}
          />

          <InfoRow
            Icon={Home}
            label="Kaam Kahan"
            value={profile.work_type}
          />

          <InfoRow
            Icon={Bike}
            label="Kitni Door Jaana"
            value={profile.travel_distance}
          />

          <InfoRow
            Icon={Clock}
            label="Kab Available"
            value={profile.available_time}
          />

        </Card>

        {/* About Me */}

        <Card>

          <SectionHead
            title={t('aboutMe')}
            action={<EditLink onClick={() => setEditing(true)} />}
          />

          <p className="text-[13px] text-gray-600 leading-relaxed">
            {profile.about}
          </p>

        </Card>

        {/* Ratings */}

        <Card>

          <SectionHead title={t('ratingsReviews')} />

          <div className="flex items-center gap-5 pb-4 border-b border-gray-50 mb-4">

            <div className="text-center">

              <p className="text-[38px] font-bold text-gray-900 leading-none">
                {profile.rating}
              </p>

              <Stars
                rating={Math.round(profile.rating)}
                size={13}
              />

              <p className="text-[11px] text-gray-400 mt-1">
                {profile.reviews} reviews
              </p>

            </div>

            <div className="flex-1 flex flex-col gap-1.5">

              {[5, 4, 3, 2, 1].map((n) => {

                const w = reviews.length ? reviews.filter(r => r.rating === n).length / reviews.length * 100 : 0;

                return (
                  <div
                    key={n}
                    className="flex items-center gap-2"
                  >

                    <span className="text-[11px] text-gray-400 w-2">
                      {n}
                    </span>

                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${w}%` }}
                      />

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

          <div className="flex flex-col gap-2.5">

            {reviews.length === 0 && <p className="text-sm text-gray-400">Abhi koi review nahi hai.</p>}
            {reviews.map((r, i) => (

              <div
                key={i}
                className="bg-[#FAF7F2] rounded-xl px-4 py-3"
              >

                <div className="flex items-center justify-between mb-1.5">

                  <div className="flex items-center gap-2">

                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 text-[11px] font-semibold">
                      {r.name[0]}
                    </div>

                    <span className="text-[12px] font-semibold text-gray-800">
                      {r.name}
                    </span>

                    <Stars
                      rating={r.rating}
                      size={10}
                    />

                  </div>

                  <span className="text-[11px] text-gray-400">
                    {r.date}
                  </span>

                </div>

                <p className="text-[12px] text-gray-600 leading-relaxed">
                  {r.text}
                </p>

              </div>

            ))}

          </div>

        </Card>

        {/* Portfolio */}

        <Card>

          <SectionHead
            title={t('portfolio')}
            action={
              <button
                disabled={saving} onClick={() => choosePhoto("portfolio")}
                className="flex items-center gap-1 text-[12px] text-rose-500 font-medium"
              >
                <Plus size={11} /> Photo Add Karo
              </button>
            }
          />

          <div className="grid grid-cols-4 gap-2">

            {(profile.portfolio || []).map((p, i) => (

              <div
                key={i}
                className={`bg-rose-50 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 relative overflow-hidden cursor-pointer`}
              >

                <img src={p.url} alt={p.label} className="w-full h-full object-cover" />

                <div className="absolute bottom-0 left-0 right-0 bg-black/15 px-1.5 py-1">

                  <p className="text-[9px] text-white font-medium">
                    {p.label}
                  </p>

                </div>

              </div>

            ))}

            <button disabled={saving || (profile.portfolio || []).length >= 4} onClick={() => choosePhoto("portfolio")} className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-rose-200 transition-colors">

              <Plus
                size={16}
                className="text-gray-300"
              />

              <p className="text-[10px] text-gray-400">
                Add
              </p>

            </button>

          </div>

        </Card>

        {/* My Work */}

        <Card>

          <SectionHead title="Mera Kaam" />

          {orders.map((o, i) => (

            <div
              key={i}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >

              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  o.done
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              <div className="flex-1 min-w-0">

                <p className="text-[13px] font-medium text-gray-800 truncate">
                  {o.name}
                </p>

                <p className="text-[11px] text-gray-400">
                  {o.date}
                </p>

              </div>

              <div className="text-right flex-shrink-0">

                <p className="text-[13px] font-semibold text-gray-700">
                  {o.amt}
                </p>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    o.done
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {o.done
                    ? "Ho Gaya"
                    : "Chal Raha Hai"}
                </span>

              </div>

            </div>

          ))}

        </Card>

        {/* Earnings */}

        <Card>

          <SectionHead title={t('earningsTitle')} />

          <div className="grid grid-cols-3 gap-2 mb-3">

            {(profile.monthly_earnings || []).map((m) => (

              <div
                key={m.month}
                className={`rounded-xl p-3 text-center ${
                  m.current
                    ? "bg-[#E8F5ED] border border-green-100"
                    : "bg-[#FAF7F2]"
                }`}
              >

                <p className="text-[13px] font-bold text-gray-800">
                  ₹{m.amount}
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  {m.month}
                </p>

              </div>

            ))}

          </div>

          <div className="bg-[#FAF7F2] rounded-xl px-4 py-3 flex justify-between items-center">

            <span className="text-[13px] text-gray-600">
              Is saal ki puri kamai
            </span>

            <span className="text-[15px] font-bold text-gray-900">
              ₹{profile.total_earnings || 0}
            </span>

          </div>

        </Card>

        {/* Settings */}

        <Card>

          <SectionHead title={t('settings')} />

          {[
            {
              Icon: Pencil,
              label: "Profile Edit Karo",
              sub: "Apni jaankari badlo",
              bg: "bg-rose-50",
              col: "text-rose-400",
              danger: false,
            },
            {
              Icon: Globe,
              label: "Bhasha Badlo",
              sub: "Hindi ya English",
              bg: "bg-purple-50",
              col: "text-purple-400",
              danger: false,
            },
            {
              Icon: LogOut,
              label: "Logout",
              sub: "Account se bahar jao",
              bg: "bg-gray-50",
              col: "text-gray-400",
              danger: true,
            },
          ].map(
            ({
              Icon,
              label,
              sub,
              bg,
              col,
              danger,
            }) => (

              <button
                key={label}
                onClick={async () => { if (label === "Logout") { try { await logoutUser(); } catch (err) { setError(err.message); } } else { setEditing(true); } }}
                className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors text-left"
              >

                <div
                  className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    size={14}
                    className={col}
                  />
                </div>

                <div className="flex-1">

                  <p
                    className={`text-[13px] font-medium ${
                      danger
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {label}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    {sub}
                  </p>

                </div>

                <ChevronRight
                  size={14}
                  className="text-gray-300"
                />

              </button>

            )
          )}

        </Card>

        <div className="h-4" />

      </div>
    </div>
  );
}
