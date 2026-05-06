"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { cafe } from "@/lib/content";

type HeaderCentreLogoProps = {
  /** For skip-link-free header: overlay centre uses pointer-events-none; pass `pointer-events-auto` here. */
  className?: string;
};

/**
 * Plain `<img>` avoids Next/Image + Sharp quirks. Asset: `/public/cousin_jacks_writing.png`.
 */
export function HeaderCentreLogo({ className = "" }: HeaderCentreLogoProps) {
  const reduce = useReducedMotion();

  return (
    <Link
      href="/"
      className={`flex min-h-[3rem] min-w-0 max-w-full items-center justify-center py-1 ${className}`.trim()}
      aria-label={`${cafe.name} home`}
    >
      <motion.div
        className="flex min-h-[3rem] w-full max-w-full items-center justify-center lg:min-h-[3.5rem]"
        initial={reduce ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cousin_jacks_writing.png"
          alt=""
          width={560}
          height={150}
          decoding="async"
          fetchPriority="high"
          className="mx-auto h-[2.55rem] w-auto max-w-full object-contain object-center sm:h-[2.9rem] md:h-[3.15rem] lg:h-[3.85rem]"
        />
      </motion.div>
    </Link>
  );
}
