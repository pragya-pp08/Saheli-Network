import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";
import AnimatedNumber from "../components/AnimatedNumber";
import ModeSwitch from "../components/ModeSwitch";

import {
  BadgeCheck,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Scissors,
  Hand,
} from "lucide-react";

/* ---------------- Verified Badge ---------------- */

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
      <BadgeCheck size={12} />
      VERIFIED PARTNER
    </span>
  );
}

/* ---------------- Time-based greeting ---------------- */

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ---------------- Welcome Card ---------------- */

function WelcomeCard({ dashboard }) {
  const greeting = getGreeting();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl border border-gray-100 px-8 py-7 min-h-[200px] flex flex-col justify-between"
    >
      <div className="relative">
        <div className="absolute right-0 top-0 opacity-[0.06] pointer-events-none select-none text-[80px] leading-none">
          🪷
        </div>

        <div className="relative z-10">
          <VerifiedBadge />

          <h1 className="text-[26px] font-bold text-gray-900 mt-2 leading-tight">
            {greeting}, {dashboard?.name || "Loading..."}
          </h1>

          <p className="text-[13px] text-gray-500 mt-1">
            You have {dashboard?.new_opportunities ?? 0} New Opportunities Today
          </p>

          <div className="mt-4 flex justify-start">
            <ModeSwitch currentMode="worker" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full">
          <Star size={12} fill="#be185d" className="text-pink-700" />

          {dashboard?.rating || 0}/5

          <span className="text-pink-400 font-normal">Community Love</span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          <BadgeCheck size={12} />

          {dashboard?.jobs_completed || 0} Jobs Completed
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- Earnings Card ---------------- */

function EarningsCard({ dashboard }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-[#E8F5ED] rounded-2xl border border-green-100 px-6 py-6 min-h-[178px]"
    >
      <p className="text-[11px] font-semibold text-green-800 uppercase tracking-wide mb-1">
        Today's Earnings
      </p>

      <p className="text-[34px] font-bold text-green-900 leading-none">
        ₹<AnimatedNumber value={dashboard?.today_earnings || 0} />
      </p>

      <div className="mt-4">
        <div className="flex justify-between text-[12px] text-green-700 mb-1.5">
          <span>This Week</span>

          <span className="font-semibold text-green-900">
            ₹<AnimatedNumber value={dashboard?.week_earnings || 0} />
          </span>
        </div>

        <div className="h-[5px] bg-green-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dashboard?.monthly_progress || 0}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Salah Card ---------------- */

function SalahCard({ dashboard, onOpen }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onOpen}
      className="bg-[#F0E6FF] border border-purple-100 rounded-2xl px-6 py-6 min-h-[330px] cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-purple-600" />
        <span className="text-[13px] font-semibold text-purple-700">
          Saheli ki Salah
        </span>
      </div>

      <p className="text-[13px] text-purple-800 leading-relaxed">
        {dashboard?.salah ||
          "Wedding season aa raha hai. Mehndi ki demand badhne wali hai."}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-purple-700"
      >
        Get Ready <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
}

/* ---------------- Jobs ---------------- */



/* ---------------- Job Card ---------------- */
function JobCard({ job, onClick, onUrgentClick }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="border p-4 rounded-lg mb-3"
    >
      <button onClick={onClick} className="text-left">{job.title}</button>
      <p className="text-xs text-gray-400">{job.dist} · {job.pay}</p>

      {job.urgent && (
        <motion.button
          onClick={onUrgentClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          Recovery Support
        </motion.button>
      )}
    </motion.div>
  );
}

/* ---------------- Today's Jobs ---------------- */

function AajKeKaamCard({ navigate, jobs = [] }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-white rounded-2xl border border-gray-100 px-6 py-6 min-h-[330px]"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[14px] font-semibold text-gray-800">
          Aaj ke Kaam
        </h2>

        <button
          onClick={() => navigate("/opportunities")}
          className="text-[12px] text-pink-500"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {jobs.length === 0 && <p className="text-sm text-gray-400">Abhi koi naya kaam nahi hai.</p>}
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => navigate("/opportunities")}
            onUrgentClick={() => navigate("/recovery-support")}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- Main Dashboard ---------------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError("");
    api("/dashboard").then(data => {
      if (!cancelled) setDashboard(data);
    }).catch(err => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-[14px]">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col gap-3 justify-center items-center h-screen text-red-500 text-[14px] px-8 text-center" role="alert">
        <p>{error}</p>
        <button onClick={() => setAttempt(n => n + 1)} className="bg-rose-500 text-white px-4 py-2 rounded-xl">Try again</button>
      </div>
    );
  }

  return (
    <div className="relative flex-1 px-10 py-8 flex flex-col gap-6 max-w-5xl mx-auto overflow-hidden">


      <div className="relative z-10 flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-[1fr_220px] gap-4">
          <WelcomeCard dashboard={dashboard} />
          <EarningsCard dashboard={dashboard} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[1fr_1.4fr] gap-4">
          <SalahCard dashboard={dashboard} onOpen={() => navigate("/salah")} />
          <AajKeKaamCard navigate={navigate} jobs={dashboard?.opportunities} />
        </div>
      </div>
    </div>
  );
}
