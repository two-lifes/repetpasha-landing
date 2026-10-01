import { type ReactNode, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealByWordProps = {
  text: string;
  className?: string;
  /** Центрирование строки (для text-center секций) */
  align?: "start" | "center";
  /** scroll — по прогрессу скролла; inView — при появлении в viewport */
  reveal?: "scroll" | "inView";
};

const headingLayout = "flex flex-wrap font-bold leading-tight text-foreground";

export function TextRevealByWord({
  text,
  className,
  align = "start",
  reveal = "scroll",
}: TextRevealByWordProps) {
  if (reveal === "inView") {
    return (
      <InViewTextReveal text={text} className={className} align={align} />
    );
  }

  return <ScrollTextReveal text={text} className={className} align={align} />;
}

function InViewTextReveal({
  text,
  className,
  align,
}: {
  text: string;
  className?: string;
  align: "start" | "center";
}) {
  const words = text.split(" ");
  const alignClass = align === "center" ? "justify-center" : undefined;
  const reducedMotion = useReducedMotion();

  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={{
        hidden: {},
        visible: {
          transition: reducedMotion
            ? { duration: 0 }
            : { staggerChildren: 0.07, delayChildren: 0.05 },
        },
      }}
      className={cn(headingLayout, alignClass, className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={{
            hidden: { opacity: reducedMotion ? 1 : 0.22 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={index < words.length - 1 ? "mr-[0.28em]" : undefined}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

function ScrollTextReveal({
  text,
  className,
  align,
}: {
  text: string;
  className?: string;
  align: "start" | "center";
}) {
  const words = text.split(" ");
  const alignClass = align === "center" ? "justify-center" : undefined;
  const targetRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.78", "start 0.38"],
  });

  return (
    <h2 ref={targetRef} className={cn(headingLayout, alignClass, className)}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;

        return (
          <ScrollWord
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            className={index < words.length - 1 ? "mr-[0.28em]" : undefined}
          >
            {word}
          </ScrollWord>
        );
      })}
    </h2>
  );
}

type WordProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
};

function ScrollWord({ children, progress, range, className }: WordProps) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      style={{ opacity: reducedMotion ? 1 : opacity }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
