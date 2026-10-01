import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ScrollFadeProps = {
  progress: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
};

/** Fade and rise driven by a shared scroll progress value. */
export function ScrollFade({ progress, range, children }: ScrollFadeProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [28, 0]);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      style={{
        opacity: reducedMotion ? 1 : opacity,
        y: reducedMotion ? 0 : y,
      }}
    >
      {children}
    </motion.div>
  );
}
