import { api } from "../services/api";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import SaheliBot from "../components/SaheliBot";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LotusLogo from "../components/LotusLogo";

import { auth } from "../firebase";
import { useLanguage } from "../i18n/LanguageContext";

const QUICK_HINGLISH = [
  "Aaj kaun sa kaam karna chahiye?",
  "Is hafte zyada kamai kaise hogi?",
  "Meri skills kaise badhau?",
  "Mehndi ke zyada order kaise milenge?",
];

export default function SalahPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const quick = language === 'hi'
    ? ["आज कौन सा काम करूँ?", "इस हफ्ते कमाई कैसे बढ़ाऊँ?", "अपने कौशल कैसे बढ़ाऊँ?", "मेहंदी के अधिक काम कैसे मिलेंगे?"]
    : language === 'en'
      ? ["Which work should I choose today?", "How can I earn more this week?", "How can I improve my skills?", "How can I get more mehndi bookings?"]
      : QUICK_HINGLISH;

  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickVisible, setQuickVisible] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* ---------------- Load Logged-in User ---------------- */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const profileData = await api("/profile");
        const userSnap = { exists: () => true, data: () => profileData };

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUserProfile({
            name: data.name || user.displayName || "Saheli",
            skills: data.skills || [],
            rating: Number(data.rating || 0),
            jobsCompleted: Number(data.jobsCompleted || 0),
            todayEarnings: Number(data.earnings?.today || 0),
            weekEarnings: Number(data.earnings?.week || 0),
            location: data.location || "",
            recoveryActive: data.recoveryStatus?.active || false,
          });
        } else {
          setUserProfile({
            name: user.displayName || "Saheli",
            skills: [],
            rating: 0,
            jobsCompleted: 0,
            todayEarnings: 0,
            weekEarnings: 0,
            location: "",
            recoveryActive: false,
          });
        }
      } catch (error) {
        setProfileError(error.message);
      }
    };

    loadUser();
  }, []);

  /* ---------------- Initial Greeting ---------------- */

  useEffect(() => {
    if (!userProfile) return;

    const greeting = language === 'hi'
      ? `नमस्ते ${userProfile.name}! मैं आपकी सहेली हूँ। आप मुझसे आसान हिंदी में काम, कौशल और कमाई के बारे में पूछ सकती हैं।`
      : language === 'en'
        ? `Hello ${userProfile.name}! I am your Saheli. You can ask me about work, skills and earnings, and I will reply in simple English.`
        : `Namaste ${userProfile.name}! Main aapki Saheli hoon. Aap mujhse kaam, skills aur kamai ke baare mein aasaan bhasha mein poochh sakti hain.`;

    setMessages([
      {
        role: "ai",
        text: greeting,
      },
    ]);
  }, [userProfile, language]);

  /* ---------------- Scroll ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ---------------- AI System Prompt ---------------- */

  function getSystemPrompt() {
    if (!userProfile) return "";

    return `You are "Saheli ki Salah" — a warm, caring AI advisor for Saheli Network, an app for skilled women in rural India.

The current logged-in user's name is ${userProfile.name}.

User profile:
- Skills: ${
      userProfile.skills.length > 0
        ? userProfile.skills.join(", ")
        : "Not specified"
    }
- Rating: ${userProfile.rating}/5
- Completed jobs: ${userProfile.jobsCompleted}
- Today's earnings: Rs ${userProfile.todayEarnings}
- This week's earnings: Rs ${userProfile.weekEarnings}
- Recovery Support: ${
      userProfile.recoveryActive ? "Active" : "Not active"
    }
- Location: ${
      userProfile.location || "Not specified"
    }

Current season: Wedding season approaching.

Rules:
1. Always reply in the SAME LANGUAGE the user writes in. Hindi in Devanagari if they write Hindi, English if English, Hinglish if mixed.
2. Keep responses short — 2 to 4 sentences max. Be practical and direct.
3. Be like a trusted older sister. Warm but not over-the-top.
4. No corporate language, no bullet lists, no bold text. Just simple conversational language.
5. Use the user's actual profile information when giving advice.
6. Do not assume the user is Shanti Devi or any other person. Always use the current logged-in user's information.
7. Never use emojis.`;
  }

  /* ---------------- Send Message ---------------- */

  async function send(text) {
    const userText = (text || input).trim();

    if (!userText || loading || !userProfile) return;

    setInput("");
    setQuickVisible(false);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
      },
    ]);

    setLoading(true);

    try {
      const history = messages
        .filter((_, i) => i > 0)
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        }));

      history.push({
        role: "user",
        content: userText,
      });

      const result = await api("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history,
          system: getSystemPrompt(),
        }),
      });

      const data = result;

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply || "Thodi der baad dobara try karein.",
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Thodi der baad dobara try karein.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  /* ---------------- Loading User ---------------- */

  if (!userProfile) {
    return (
      <div className="relative flex-1 flex items-center justify-center bg-[#FAF7F2]">


        <div className="text-center text-gray-500">
          <LotusLogo size={45} />

          <p className="mt-4 text-sm">
            {profileError || "Loading your Saheli..."}
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className="relative flex-1 flex flex-col bg-[#FAF7F2] overflow-hidden"
      style={{ height: "100vh" }}
    >


      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-100 flex-shrink-0">

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={17} />
        </motion.button>

        <motion.div
          animate={{
            rotate: [0, -8, 8, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0"
        >
          <LotusLogo size={16} />
        </motion.div>

        <div>
          <p className="text-[14px] font-semibold text-gray-900">
          {t('advice')}
          </p>

          <p className="text-[11px] text-purple-500">
            {t('adviceSubtitle')}
          </p>
        </div>
      </div>

      {/* Intro */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 flex flex-col items-center"
        >
          <SaheliBot />

          <motion.h2
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="mt-5 text-2xl font-bold text-gray-800"
          >
            {t('namaste')}
          </motion.h2>

          <p className="mt-2 text-gray-500 text-sm">
            {t('saheliIntro')}
          </p>
        </motion.div>
      )}

      {/* Quick Prompts */}
      {quickVisible && (
        <div className="px-4 pt-3 pb-1 flex gap-2 flex-wrap flex-shrink-0">
          {quick.map((q) => (
            <motion.button
              key={q}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => send(q)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-purple-100 bg-white text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2 items-end ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >

            {/* AI Avatar */}
            {msg.role === "ai" && (
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="w-7 h-7 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0 mb-0.5"
              >
                <LotusLogo size={14} />
              </motion.div>
            )}

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center flex-shrink-0 mb-0.5 text-white text-[12px] font-semibold">
                {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div
              className={`max-w-[75%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                msg.role === "ai"
                  ? "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                  : "bg-rose-500 text-white rounded-2xl rounded-br-sm"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-2 items-end">

            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="w-7 h-7 rounded-full bg-[#F0E6FF] flex items-center justify-center flex-shrink-0"
            >
              <LotusLogo size={14} />
            </motion.div>

            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">

              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />

              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />

              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />

            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-4 pb-5 pt-2 bg-white border-t border-gray-100 flex-shrink-0">

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={t('askAnything')}
          rows={1}
          className="flex-1 resize-none bg-[#FAF7F2] border border-gray-200 rounded-2xl px-4 py-2.5 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-200 transition max-h-24 leading-relaxed"
          style={{ minHeight: "40px" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height =
              Math.min(e.target.scrollHeight, 96) + "px";
          }}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send
            size={15}
            className={
              input.trim() ? "text-white" : "text-gray-400"
            }
          />
        </motion.button>
      </div>
    </div>
  );
}
