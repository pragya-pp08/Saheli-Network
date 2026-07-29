import React, { useState } from "react";
import { motion } from "framer-motion";
import LotusLogo from "../components/LotusLogo";
import FloatingPetals from "../components/FloatingPetals";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  function handleContinue() {
    onLogin();
    navigate("/");
  }

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
      <FloatingPetals />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white rounded-3xl shadow-lg p-10 w-[420px]"
      >
        <div className="flex flex-col items-center">
          <LotusLogo size={60} />

          <h1 className="text-3xl font-bold mt-5 text-rose-500">
            Saheli Network
          </h1>

          <p className="text-gray-500 mt-2 text-center">
            Empowering skilled women with nearby work opportunities
          </p>
        </div>

        <div className="mt-8">
          <label className="font-medium">Phone Number</label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full border rounded-xl p-3 mt-2"
          />
        </div>

        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-8 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
}