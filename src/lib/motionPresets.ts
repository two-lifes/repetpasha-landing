import type { Transition, Variants } from "framer-motion";

/** AOS fade-up: duration 1000ms, typical vertical offset ~40px */
export function fadeUpTransition(delayMs = 0): Transition {
  return {
    duration: 1,
    delay: delayMs / 1000,
    ease: [0.25, 0.46, 0.45, 0.94],
  };
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;
