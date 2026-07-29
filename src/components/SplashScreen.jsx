import React from "react";
import { motion } from "framer-motion";
import LotusLogo from "./LotusLogo";
import FloatingPetals from "./FloatingPetals";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-[#FAF7F2] flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingPetals />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <LotusLogo size={70} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-5 text-4xl font-bold text-rose-500"
        >
          Saheli Network
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-2 text-gray-500 text-sm tracking-wide"
        >
          Empowering Women, One Skill at a Time
        </motion.p>
      </div>
    </motion.div>
  );
}