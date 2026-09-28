import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowRight, Sparkles } from "lucide-react";
import { api } from "../services/api";
import ModeSwitch from "../components/ModeSwitch";
import { useLanguage } from "../i18n/LanguageContext";

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t("morning");
  if (hour < 17) return t("afternoon");
  return t("evening");
}

function WelcomeCard({ data, navigate, t }) {
  const greeting = getGreeting(t);
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-white rounded-2xl border border-gray-100 px-8 py-7 min-h-[200px] flex flex-col justify-between">
      <div className="relative">
        <div className="absolute right-0 top-0 opacity-[0.06] pointer-events-none select-none text-[80px] leading-none">🪷</div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full"><BadgeCheck size={12} /> {t("verified")}</span>
          <h1 className="text-[26px] font-bold text-gray-900 mt-2 leading-tight">{greeting}, {data.name}</h1>
          <p className="text-[13px] text-gray-500 mt-1">{t("findNearby")}</p>
          <div className="flex items-center gap-4 mt-4">
            <button onClick={() => navigate("/customer-jobs")} className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">{t("hireAction")}</button>
            <ModeSwitch currentMode="customer" compact />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full">{t("jobsPosted", { count: data.posted })}</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full"><BadgeCheck size={12} /> {t("applicationsCount", { count: data.applications })}</span>
      </div>
    </motion.div>
  );
}

function PaymentCard({ data, t }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-[#E8F5ED] rounded-2xl border border-green-100 px-6 py-6 min-h-[178px]">
      <p className="text-[11px] font-semibold text-green-800 uppercase tracking-wide mb-1">{t("paymentDue")}</p>
      <p className="text-[34px] font-bold text-green-900 leading-none">{data.payment_due}</p>
      <div className="mt-4 flex justify-between text-[12px] text-green-700"><span>{t("activeOrders")}</span><span className="font-semibold text-green-900">{data.active}</span></div>
      <div className="h-[5px] bg-green-200 rounded-full overflow-hidden mt-1.5"><div className="h-full bg-green-600 rounded-full" style={{ width: data.active ? "65%" : "0%" }} /></div>
    </motion.div>
  );
}

function HiringCard({ data, navigate, t }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} onClick={() => navigate("/customer-jobs")} className="bg-[#F0E6FF] border border-purple-100 rounded-2xl px-6 py-6 min-h-[330px] cursor-pointer">
      <div className="flex items-center gap-2 mb-3"><Sparkles size={14} className="text-purple-600" /><span className="text-[13px] font-semibold text-purple-700">{t("hireAction").replace("+ ", "")}</span></div>
      <p className="text-[13px] text-purple-800 leading-relaxed">{t("hireCardText")}</p>
      <div className="mt-5 text-[12px] text-purple-700 space-y-2">
        <p>{t("jobsPosted", { count: data.posted })}</p>
        <p>{t("applicationsReceived", { count: data.applications })}</p>
        <p><span className="font-semibold">{data.active}</span> {t("activeOrders")}</p>
      </div>
      <button className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-purple-700">{t("postJob")} <ArrowRight size={14} /></button>
    </motion.div>
  );
}

function RecentJobs({ data, navigate, t }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} className="bg-white rounded-2xl border border-gray-100 px-6 py-6 min-h-[330px]">
      <div className="flex justify-between items-center mb-3"><h2 className="text-[14px] font-semibold text-gray-800">{t("todaysWork")}</h2><button onClick={() => navigate("/customer-jobs")} className="text-[12px] text-pink-500">{t("viewAll")}</button></div>
      <div className="flex flex-col gap-2">
        {!data.recent.length && <p className="text-sm text-gray-400">{t("noWork")}</p>}
        {data.recent.map(job => <button key={job.id} onClick={() => navigate("/customer-jobs")} className="border p-4 rounded-lg text-left"><p>{job.title}</p><p className="text-xs text-gray-400 mt-1">{job.location} · {job.date}</p></button>)}
      </div>
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api("/customer-dashboard").then(value => { if (!cancelled) setData(value); }).catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
  if (!data) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="relative flex-1 px-4 md:px-10 py-5 md:py-8 flex flex-col gap-6 max-w-5xl mx-auto overflow-y-auto">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4"><WelcomeCard data={data} navigate={navigate} t={t} /><PaymentCard data={data} t={t} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4"><HiringCard data={data} navigate={navigate} t={t} /><RecentJobs data={data} navigate={navigate} t={t} /></div>
      </div>
    </div>
  );
}
