"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const STORAGE_KEY = "cj-intro-splash-complete";

export function IntroSplash() {
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
        setReady(true);
        return;
      }
    } catch {
      /* private mode etc. */
    }
    setVisible(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const ms = prefersReducedMotion ? 350 : 2800;
    const t = window.setTimeout(() => setVisible(false), ms);
    return () => window.clearTimeout(t);
  }, [visible, prefersReducedMotion]);

  if (!ready) return null;

  return (
    <AnimatePresence
      mode="sync"
      onExitComplete={() => {
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      }}
    >
      {visible ? (
        <motion.div
          key="cj-splash"
          role="presentation"
          aria-hidden
          className="cj-splash fixed inset-0 z-[130] flex items-center justify-center overflow-visible bg-[#050302]"
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : "-14%" }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,122,0,0.08),transparent_50%)]" />
          <div aria-hidden="true" className="cj-texture-overlay pointer-events-none absolute inset-0 opacity-25" />

          <motion.div className="relative z-[2] mx-auto flex w-full max-w-lg flex-col items-center px-6 pt-28 pb-20 sm:pt-32">
            <div className="relative flex justify-center [&_.cj-css-steam]:pointer-events-none">
              <motion.div aria-hidden className="cj-css-steam cj-css-steam--one absolute -top-28 left-[42%] z-[3]" />
              <motion.div aria-hidden className="cj-css-steam cj-css-steam--two absolute -top-[6.85rem] left-1/2 z-[3] -translate-x-1/2" />
              <motion.div aria-hidden className="cj-css-steam cj-css-steam--three absolute -top-[6.85rem] left-[58%] z-[3]" />

              {/* Cup mark only (no wordmark block) */}
              <motion.img
                src="/cousin_jacks_logo.png"
                alt=""
                width={288}
                height={340}
                className="relative z-[2] h-auto w-[min(220px,48vw)] max-w-none select-none bg-transparent object-contain"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.88, filter: "blur(8px)", y: 14 }
                }
                animate={{
                  opacity: 1,
                  scale: prefersReducedMotion ? 1 : 1,
                  filter: prefersReducedMotion ? "blur(0px)" : "blur(0px)",
                  y: 0,
                  rotate: prefersReducedMotion ? 0 : [0, 2.2, -1.2, 0],
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.08 }
                    : {
                        opacity: { duration: 0.65 },
                        scale: { duration: 0.92, ease: [0.22, 1, 0.36, 1] },
                        filter: { duration: 0.92 },
                        y: { duration: 0.92, ease: [0.22, 1, 0.36, 1] },
                        rotate: { duration: 4.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 },
                      }
                }
              />
            </div>

            {!prefersReducedMotion ? (
              <motion.span
                aria-hidden
                className="cj-splash-accent-line mt-7 h-px w-40 bg-gradient-to-r from-transparent via-[var(--cj-orange)] to-transparent"
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.92, duration: 0.45 }}
              />
            ) : (
              <span aria-hidden className="mt-7 h-px w-40 bg-[var(--cj-orange)]/60" />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
