import React from "react";
import { motion } from "framer-motion";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const PETAL_COUNT = 14;

export default function FloatingPetals() {
  const petals = React.useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        left: random(0, 100),
        size: random(14, 26),
        duration: random(14, 22),
        delay: random(0, 10),
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[9999]">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            top: "-40px",
            opacity: 0.35,
          }}
          initial={{ y: "-10vh", rotate: 0 }}
          animate={{
            y: "110vh",
            rotate: 360,
            x: [0, 15, -15, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}