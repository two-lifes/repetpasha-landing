import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type TextOpacity = "none" | "soft" | "medium";
type ViewType = "word" | "letter";

type TextGradientScrollProps = {
  text: string;
  type?: ViewType;
  className?: string;
  textOpacity?: TextOpacity;
};

type TextGradientScrollContextValue = {
  textOpacity: TextOpacity;
};

const TextGradientScrollContext =
  createContext<TextGradientScrollContextValue>({
    textOpacity: "soft",
  });

const ghostOpacityClass: Record<TextOpacity, string> = {
  none: "opacity-0",
  soft: "opacity-10",
  medium: "opacity-30",
};

export function TextGradientScroll({
  text,
  className,
  type = "letter",
  textOpacity = "soft",
}: TextGradientScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.72", "end 0.42"],
  });
  const words = text.split(" ");

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity }}>
      <p ref={ref} className={cn("m-0", className)}>
        {words.map((word, index) => {
          const start = index / words.length;
          const end = start + 1 / words.length;

          return type === "word" ? (
            <Word
              key={`${word}-${index}`}
              progress={scrollYProgress}
              range={[start, end]}
            >
              {word}
            </Word>
          ) : (
            <Letter
              key={`${word}-${index}`}
              progress={scrollYProgress}
              range={[start, end]}
            >
              {word}
            </Letter>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

type PieceProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Word({ children, progress, range }: PieceProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  const reducedMotion = useReducedMotion();
  const { textOpacity } = useContext(TextGradientScrollContext);

  return (
    <span className="me-[0.28em] inline-grid">
      <span
        className={cn("col-start-1 row-start-1", ghostOpacityClass[textOpacity])}
        aria-hidden
      >
        {children}
      </span>
      <motion.span
        style={{ opacity: reducedMotion ? 1 : opacity }}
        className="col-start-1 row-start-1"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Letter({ children, progress, range }: PieceProps) {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="me-[0.28em] inline-block">
      {children.split("").map((char, index) => {
        const start = range[0] + index * step;
        const end = range[0] + (index + 1) * step;

        return (
          <Char
            key={`${char}-${index}`}
            progress={progress}
            range={[start, end]}
          >
            {char}
          </Char>
        );
      })}
    </span>
  );
}

type CharProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
};

function Char({ children, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  const reducedMotion = useReducedMotion();
  const { textOpacity } = useContext(TextGradientScrollContext);

  return (
    <span className="inline-grid">
      <span
        className={cn("col-start-1 row-start-1", ghostOpacityClass[textOpacity])}
        aria-hidden
      >
        {children}
      </span>
      <motion.span
        style={{ opacity: reducedMotion ? 1 : opacity }}
        className="col-start-1 row-start-1"
      >
        {children}
      </motion.span>
    </span>
  );
}
