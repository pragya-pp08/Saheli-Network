import React, { useState } from "react";
import { motion } from "framer-motion";
import LotusLogo from "../components/LotusLogo";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/auth";
import { updateProfile } from "firebase/auth";
import { post } from "../services/api";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";


export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountMode, setAccountMode] = useState("worker");

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const userCredential = await registerUser(email, password);

        const user = userCredential.user;

        await updateProfile(user, { displayName: name.trim() });
        await user.getIdToken(true);
        await post('/account-mode', { mode: accountMode });
      } else {
        await loginUser(email, password);
      }
      onLogin(isRegister ? accountMode : null);
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-3xl shadow-lg p-10 w-[420px]"
      >

        <LanguageSelector className="absolute right-5 top-5" />

        {/* Logo */}
        <div className="flex flex-col items-center">

          <LotusLogo size={60} />

          <h1 className="text-3xl font-bold mt-5 text-rose-500">
            Saheli Network
          </h1>

          <p className="text-gray-500 mt-2 text-center">
            {t("tagline")}
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8">

          {isRegister && (
            <>
              <label className="font-medium text-gray-700">
                {t("name")}
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enterName")}
                required
                className="w-full border rounded-xl p-3 mt-2 mb-5 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />

              <p className="font-medium text-gray-700 mb-2">{t("chooseRole")}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setAccountMode("worker")}
                  className={`border rounded-xl p-3 text-sm transition ${accountMode === "worker" ? "bg-rose-50 border-rose-300 text-rose-600" : "border-gray-200 text-gray-500"}`}
                >
                  {t("needWork")}
                </button>
                <button
                  type="button"
                  onClick={() => setAccountMode("customer")}
                  className={`border rounded-xl p-3 text-sm transition ${accountMode === "customer" ? "bg-rose-50 border-rose-300 text-rose-600" : "border-gray-200 text-gray-500"}`}
                >
                  {t("hireWork")}
                </button>
              </div>
            </>
          )}

          <label className="font-medium text-gray-700">
            {t("email")}
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="saheli@example.com"
            required
            className="w-full border rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />

          <label className="font-medium text-gray-700 block mt-5">
            {t("password")}
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full border rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white py-3 rounded-xl transition"
          >
            {loading
              ? t("pleaseWait")
              : isRegister
              ? t("createAccount")
              : t("login")}
          </button>

        </form>

        {/* Switch */}
        <p className="text-center text-sm text-gray-500 mt-5">

          {isRegister
            ? t("alreadyAccount")
            : t("newHere")}

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="ml-1 text-rose-500 font-medium hover:underline"
          >
            {isRegister ? t("login") : t("createAccount")}
          </button>

        </p>

      </motion.div>

    </div>
  );
}
