import { motion } from "framer-motion";
import LotusLogo from "./LotusLogo";

export default function SaheliBot() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{
        scale: [1, 1.05, 1],
        y: [0, -6, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 3,
      }}
      className="relative flex items-center justify-center"
    >
      {/* Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.15, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
        }}
        className="absolute w-28 h-28 rounded-full bg-pink-200 blur-2xl"
      />

      {/* Face */}
      <div className="relative w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border border-pink-100">

        <LotusLogo size={42} />

        {/* Left Eye */}
        <motion.div
          animate={{
            scaleY: [1, 0.05, 1],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="absolute left-7 top-8 w-2 h-2 rounded-full bg-gray-700 origin-center"
        />

        {/* Right Eye */}
        <motion.div
          animate={{
            scaleY: [1, 0.05, 1],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="absolute right-7 top-8 w-2 h-2 rounded-full bg-gray-700 origin-center"
        />

        {/* Smile */}
        <div className="absolute bottom-6 w-6 h-3 border-b-2 border-gray-500 rounded-full" />
      </div>
    </motion.div>
  );
}