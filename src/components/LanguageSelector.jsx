import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageSelector({ className = "" }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className={`inline-flex items-center gap-1.5 text-[11px] text-gray-500 ${className}`}>
      <span>{t("language")}</span>
      <select
        aria-label="Language"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-gray-600 outline-none focus:border-rose-300"
      >
        <option value="hinglish">Hinglish</option>
        <option value="hi">हिंदी</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
