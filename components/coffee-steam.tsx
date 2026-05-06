"use client";

import { motion } from "motion/react";

const paths = [
  "M58 92 C52 76 62 62 54 42",
  "M72 92 C76 74 68 56 74 38",
  "M86 90 C94 74 82 54 92 34",
];

export function CoffeeSteam({ className = "", dense = false }: { className?: string; dense?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute left-1/2 z-0 -translate-x-1/2 overflow-visible text-[var(--cj-cream)]/45 ${className}`}
      viewBox="0 0 120 96"
    >
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={dense ? 1.75 : 2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.52, 0], y: [0, dense ? -14 : -18, dense ? -28 : -32] }}
          transition={{
            duration: dense ? 2.15 : 2.45,
            delay: i * 0.24,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}
