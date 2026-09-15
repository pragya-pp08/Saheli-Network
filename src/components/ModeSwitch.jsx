import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Users } from "lucide-react";
import { post } from "../services/api";
import { useLanguage } from "../i18n/LanguageContext";

export default function ModeSwitch({ currentMode = "worker", compact = false, subtle = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  const nextMode = currentMode === "customer" ? "worker" : "customer";
  const Icon = nextMode === "customer" ? Users : BriefcaseBusiness;
  const label = nextMode === "customer" ? t("hireSaheli") : t("findWork");

  async function switchMode() {
    if (switching) return;
    setSwitching(true);
    setError("");
    try {
      await post("/account-mode", { mode: nextMode });
      window.dispatchEvent(new CustomEvent("saheli-mode-changed", { detail: { mode: nextMode } }));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className={compact || subtle ? "text-right" : "flex flex-col items-end"}>
      <button
        type="button"
        onClick={switchMode}
        disabled={switching}
        className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-60 ${
          subtle
            ? "text-[11px] text-rose-500 hover:text-rose-600"
            : compact
              ? "gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-600 hover:bg-rose-100"
              : "gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm text-white shadow-sm hover:bg-rose-600"
        }`}
      >
        {!subtle && <Icon size={compact ? 14 : 16} />}
        {switching ? "Switching..." : label}
      </button>
      {error && <p className="mt-1 text-[11px] text-red-500" role="alert">{error}</p>}
    </div>
  );
}
