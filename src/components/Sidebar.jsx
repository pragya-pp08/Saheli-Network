import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Coins,
  MessageCircleHeart,
  ShieldCheck,
  Bell,
} from "lucide-react";
import LotusLogo from "./LotusLogo";

import { api } from "../services/api";
import Notifications from "./Notifications";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

const navItems = [
  { to: "/profile", icon: User, labelKey: "profile" },
  { to: "/", icon: LayoutDashboard, labelKey: "dashboard" },
  { to: "/opportunities", icon: Briefcase, labelKey: "opportunities" },
  { to: "/orders", icon: ClipboardList, labelKey: "orders" },
  { to: "/earnings", icon: Coins, labelKey: "earnings" },
  { to: "/salah", icon: MessageCircleHeart, labelKey: "advice" },
];

export default function Sidebar({ accountMode = "worker" }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const load = () => api('/account-summary').then(data => { if (!cancelled) setSummary(data); }).catch(() => {});
    load(); const timer = setInterval(load, 60000);
    window.addEventListener('saheli-data-changed', load);
    return () => { cancelled = true; clearInterval(timer); window.removeEventListener('saheli-data-changed', load); };
  }, []);

  return (
    <aside className="w-52 min-w-[208px] flex flex-col bg-white border-r border-gray-100 min-h-screen">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <LotusLogo size={18} />
          <span className="font-semibold text-[15px] text-rose-500 tracking-tight">
            Saheli Network
          </span>
        </div>

        <motion.button aria-label="Notifications" onClick={() => setShowNotifications(true)}
          animate={{ rotate: [0, 15, -12, 8, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 7.4,
            ease: "easeInOut",
          }}
        >
          <Bell size={16} className={summary?.unread ? "text-rose-500" : "text-gray-400"} />
        </motion.button>
        {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
      </div>

      <div className="flex flex-col items-start px-4 pt-4 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center text-white font-semibold text-lg mb-2 shadow-sm">
          {summary?.name?.charAt(0)?.toUpperCase() || "S"}
        </div>

        <p className="text-[13px] font-semibold text-gray-800">
          {t("welcome")}, {summary?.name || "Saheli"}
        </p>

        <p className="text-[11px] text-gray-400 mt-0.5">
          {t("member")}
        </p>
        <LanguageSelector className="mt-2" />
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pt-2 flex-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to === "/opportunities" && accountMode === "customer" ? "/customer-jobs" : to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] transition-colors duration-150 ${
                isActive
                  ? "bg-rose-50 text-rose-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            <Icon size={15} />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[11px] font-medium text-gray-500 mb-1.5">
          {t("myOrders")}
        </p>

        <div className="flex justify-between text-[12px] text-gray-500">
          <span>{t("completed")}</span>
          <span className="font-medium text-gray-700">{summary?.completed ?? 0}</span>
        </div>

        <div className="flex justify-between text-[12px] text-gray-500 mt-0.5">
          <span>{t("pending")}</span>
          <span className="font-medium text-gray-700">{summary?.pending ?? 0}</span>
        </div>
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={() => navigate("/recovery-support")}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium py-2.5 rounded-xl transition-colors"
        >
          <ShieldCheck size={14} />
          {summary?.recovery ? t("recoveryActive") : t("recovery")}
        </button>
      </div>
    </aside>
  );
}
