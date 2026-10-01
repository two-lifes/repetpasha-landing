import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const SPRING_MOUSE = {
  stiffness: 260,
  damping: 24,
  mass: 0.45,
} as const;

function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}

export type TiltCardProps = {
  children: ReactNode;
  max?: number;
  glare?: boolean;
  className?: string;
};

export function TiltCard({
  children,
  max = 8,
  glare = true,
  className,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const enabled = !reduce && canHover;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const scale = useMotionValue(1);
  const glareOpacity = useMotionValue(0);

  const srx = useSpring(rx, SPRING_MOUSE);
  const sry = useSpring(ry, SPRING_MOUSE);
  const smoothScale = useSpring(scale, SPRING_MOUSE);
  const smoothGlareOpacity = useSpring(glareOpacity, SPRING_MOUSE);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.7), transparent 48%)`;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;

    if (!el || !enabled) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    ry.set((px - 0.5) * max);
    rx.set((0.5 - py) * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onEnter = () => {
    if (!enabled) return;
    scale.set(1.015);
    glareOpacity.set(0.1);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
    scale.set(1);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: smoothScale,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative isolate transform-gpu will-change-transform",
        className,
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[inherit]">
        {children}

        {glare && enabled ? (
          <motion.div
            aria-hidden
            style={{
              opacity: smoothGlareOpacity,
              background: glareBackground,
            }}
            className="pointer-events-none absolute inset-0"
          />
        ) : null}
      </div>
    </motion.div>
  );
}
