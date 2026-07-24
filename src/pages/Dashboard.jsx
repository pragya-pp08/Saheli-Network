import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardService";

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

/* ---------------- Welcome Card ---------------- */

function WelcomeCard({ dashboard }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col justify-between">
      <div className="relative">
        <div className="absolute right-0 top-0 opacity-[0.06] pointer-events-none select-none text-[80px] leading-none">
          🪷
        </div>

        <div className="relative z-10">
          <VerifiedBadge />

          <h1 className="text-[26px] font-bold text-gray-900 mt-2 leading-tight">
            Namaste, {dashboard?.name || "Loading..."}!
          </h1>

          <p className="text-[13px] text-gray-500 mt-1">
            You have 3 New Opportunities Today
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full">
          <Star size={12} fill="#be185d" className="text-pink-700" />

          {dashboard?.rating || 0}/5

          <span className="text-pink-400 font-normal">
            Community Love
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          <BadgeCheck size={12} />

          {dashboard?.jobs_completed || 0} Jobs Completed
        </span>
      </div>
    </div>
  );
}

/* ---------------- Earnings Card ---------------- */

function EarningsCard({ dashboard }) {
  return (
    <div className="bg-[#E8F5ED] rounded-2xl border border-green-100 px-5 py-5">
      <p className="text-[11px] font-semibold text-green-800 uppercase tracking-wide mb-1">
        Today's Earnings
      </p>

      <p className="text-[34px] font-bold text-green-900 leading-none">
        ₹{dashboard?.today_earnings || 0}
      </p>

      <div className="mt-4">
        <div className="flex justify-between text-[12px] text-green-700 mb-1.5">
          <span>This Week</span>

          <span className="font-semibold text-green-900">
            ₹{dashboard?.week_earnings || 0}
          </span>
        </div>

        <div className="h-[5px] bg-green-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full"
            style={{
              width: `${dashboard?.weekly_progress || 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Salah Card ---------------- */

function SalahCard({ onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="bg-[#F0E6FF] border border-purple-100 rounded-2xl px-5 py-5 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-purple-600" />
        <span className="text-[13px] font-semibold text-purple-700">
          Saheli ki Salah
        </span>
      </div>

      <p className="text-[13px] text-purple-800 leading-relaxed">
        Wedding season aa raha hai. Mehndi ki demand badhne wali hai.
      </p>

      <button className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-purple-700">
        Get Ready <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ---------------- Jobs ---------------- */

const jobs = [
  {
    id: 1,
    icon: Scissors,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    name: "Stitching Order",
    meta: "2 km away · ₹500",
    urgent: false,
  },
  {
    id: 2,
    icon: Hand,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    name: "Mehndi Booking",
    meta: "0.5 km away · ₹1800",
    urgent: false,
  },
  {
    id: 3,
    icon: AlertCircle,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    name: "Immediate Income Opportunity",
    meta: "15 mins left · ₹2000",
    urgent: true,
  },
];

/* ---------------- Job Card ---------------- */

function JobCard({ job }) {
  const Icon = job.icon;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-shadow hover:shadow-sm cursor-pointer ${
        job.urgent
          ? "bg-[#FFF8F0] border-l-[3px] border-l-amber-400 border-t-amber-100 border-r-amber-100 border-b-amber-100"
          : "bg-[#FAF7F2] border-gray-100"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${job.iconBg} flex items-center justify-center`}
      >
        <Icon size={16} className={job.iconColor} />
      </div>

      <div className="flex-1">
        <p className="text-[13px] font-medium text-gray-800">{job.name}</p>

        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
          <MapPin size={10} />
          {job.meta}
        </p>
      </div>

      {job.urgent && (
        <span className="text-[11px] font-semibold bg-red-600 text-white px-2 py-1 rounded-lg">
          Recovery Support
        </span>
      )}
    </div>
  );
}

/* ---------------- Today's Jobs ---------------- */

function AajKeKaamCard({ navigate })  {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[14px] font-semibold text-gray-800">
          Aaj ke Kaam
        </h2>

        <button 
  onClick={() => navigate("/opportunities")}
  className="text-[12px] text-pink-500">
  View All
</button>
      </div>

      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
/* ── Main Dashboard ── */
/* ---------------- Main Dashboard ---------------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();

        console.log("Dashboard Data:", data);

        setDashboard(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="flex-1 p-6 flex flex-col gap-5 max-w-4xl">

      {/* Row 1 */}

      <div className="grid grid-cols-[1fr_220px] gap-4">

        <WelcomeCard dashboard={dashboard} />

        <EarningsCard dashboard={dashboard} />

      </div>

      {/* Row 2 */}

      <div className="grid grid-cols-[1fr_1.4fr] gap-4">

        <SalahCard onOpen={() => navigate("/salah")} />

        <AajKeKaamCard navigate={navigate} />

      </div>

    </div>
  );
}