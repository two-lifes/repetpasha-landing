import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ModuleMockupCard,
  type ModuleMockupType,
} from "@/components/ui/ModuleMockupCard";

export type WorksWheelMockupType = ModuleMockupType;
export type { ModuleMockupType };

export interface WorksWheelItem {
  title: string;
  comment?: string;
  image?: string;
  mockupType?: WorksWheelMockupType;
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
}

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;

/** Scroll distance per wheel step, in viewport heights */
const SCROLL_PER_STEP = 0.6;
const EASE = 0.12;
/** Extra fade-in while scrolling inside the wheel section (turn units) */
const SCROLL_START = 0.01;
const REVEAL_RAMP = 0.05;
/** Section top (as fraction of viewport height): start → end = 0 → 1 entry reveal */
const ENTRY_REVEAL_START = 0.95;
const ENTRY_REVEAL_END = 0.08;
/** Must match the max-w-[35%] of the left title block */
const TITLE_MAX_W = 0.35;
const SIDE_GAP = 32;
/** Width kept free for the step list on the right */
const INDEX_RESERVE = 320;
const MIN_CARD_W = 0.22;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

type WheelCardProps = {
  item: WorksWheelItem;
  index: number;
  active: boolean;
  action: string;
  metrics: {
    cardW: number;
    cardH: number;
  };
  cardRef: (node: HTMLElement | null) => void;
};

function WheelCardMedia({ item }: { item: WorksWheelItem }) {
  if (item.mockupType) {
    return (
      <ModuleMockupCard type={item.mockupType} />
    );
  }
  if (item.image) {
    return (
      <img
        src={item.image}
        alt=""
        draggable={false}
        className="size-full object-cover"
      />
    );
  }
  return (
    <div className="flex size-full items-center justify-center bg-zinc-100 text-xs text-zinc-500">
      —
    </div>
  );
}

function WheelCard({
  item,
  index,
  active,
  action,
  metrics,
  cardRef,
}: WheelCardProps) {
  const isMockup = Boolean(item.mockupType);

  const face = (
    <span
      className={cn(
        "relative block size-full overflow-hidden rounded-xl shadow-xl",
        isMockup
          ? "rounded-2xl border border-white/[0.08] bg-[#161618] shadow-2xl shadow-black/40"
          : "border border-border bg-card shadow-lg shadow-black/20",
      )}
    >
      <WheelCardMedia item={item} />
      {action ? (
        <span className="pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-background opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
          {action}
          <svg
            viewBox="0 0 12 12"
            className="size-3 text-primary-light"
            aria-hidden="true"
          >
            <path
              d="M3 9 9 3M4 3h5v5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </span>
  );

  const shared = {
    ref: cardRef,
    id: `works-wheel-${index}`,
    "aria-current": active ? ("true" as const) : undefined,
    className: "group absolute [backface-visibility:hidden]",
    style: {
      width: metrics.cardW,
      height: metrics.cardH,
      marginLeft: -metrics.cardW / 2,
      marginTop: -metrics.cardH / 2,
    },
  };

  if (item.href) {
    return (
      <a href={item.href} {...shared}>
        {face}
      </a>
    );
  }

  return <div {...shared}>{face}</div>;
}

export function WorksWheel({
  items,
  label = "ЕГЭ 2026",
  action = "Разбор",
  className,
  ...props
}: WorksWheelProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const indexRef = React.useRef<HTMLOListElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const entryReveal = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const edgePad = w >= 1024 ? 32 : w >= 640 ? 24 : 16;
    const titleRight = edgePad + w * TITLE_MAX_W;
    const drumLeft = titleRight + SIDE_GAP;
    const drumRight = w - (w >= 640 ? INDEX_RESERVE : edgePad);
    let cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    if (drumRight - drumLeft > 0) {
      cardW = Math.min(cardW, Math.max(drumRight - drumLeft, w * MIN_CARD_W));
    }
    const shiftX = Math.max(0, drumLeft - (w / 2 - cardW / 2));
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      shiftX,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow, shiftX } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      const scrollReveal =
        target.current <= SCROLL_START
          ? 0
          : clamp((target.current - SCROLL_START) / REVEAL_RAMP, 0, 1);
      const reveal = Math.max(entryReveal.current, scrollReveal);
      const offset = m * shiftX;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateX(${offset}px) translateZ(${-m * drumR}px)`;
      }
      if (stageRef.current) {
        stageRef.current.style.perspectiveOrigin = `calc(50% + ${offset}px) 50%`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          const culled = m > 0.5 && Math.abs(d) > CULL;
          card.style.opacity = String(culled ? 0 : reveal);
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String((1 - m) * reveal);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      if (indexRef.current) indexRef.current.style.opacity = String(reveal);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? clamp(-rect.top / range, 0, 1) : 0;
      target.current = progress * (last + 1);

      const vh = window.innerHeight;
      const top = rect.top;
      const startY = vh * ENTRY_REVEAL_START;
      const endY = vh * ENTRY_REVEAL_END;
      if (top <= endY) {
        entryReveal.current = 1;
      } else if (top < startY) {
        entryReveal.current = clamp(
          (startY - top) / (startY - endY),
          0,
          1,
        );
      } else {
        entryReveal.current = 0;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [last]);

  const scrollToStep = (step: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (step / (last + 1)) * range,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const steps = last + 1;

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className={cn("relative w-full text-foreground select-none", className)}
      style={{ height: `${100 + steps * SCROLL_PER_STEP * 100}vh` }}
      {...props}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{ perspective: `${metrics.depth}px` }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          >
            {items.map((item, i) => (
              <WheelCard
                key={item.title}
                item={item}
                index={i}
                active={i === active}
                action={action}
                metrics={metrics}
                cardRef={(node) => {
                  cardRefs.current[i] = node;
                }}
              />
            ))}
          </div>
        </div>

        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-0 grid place-items-center font-bold tracking-tight text-foreground opacity-0"
          style={{ fontSize: metrics.title }}
        >
          {label}
        </div>
        <div
          ref={titleRef}
          className="pointer-events-none absolute top-1/2 left-4 max-w-[35%] -translate-y-1/2 opacity-0 sm:left-6 lg:left-8"
        >
          <p
            className="font-bold tracking-tight text-foreground"
            style={{ fontSize: metrics.title }}
          >
            {items[active]?.title}
          </p>
          {items[active]?.comment ? (
            <p className="mt-3 text-lg font-normal leading-relaxed text-muted-foreground">
              {items[active].comment}
            </p>
          ) : null}
        </div>

        <ol
          ref={indexRef}
          className="absolute top-[12%] right-4 text-right font-mono text-xs leading-[2] text-zinc-600 opacity-0 max-sm:hidden sm:right-6 lg:right-8"
          style={{ fontSize: metrics.index }}
        >
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => scrollToStep(i + 1)}
                className={cn(
                  "cursor-pointer text-zinc-600 transition-colors outline-none hover:text-zinc-300 focus-visible:text-zinc-300",
                  i === active && "font-bold text-primary hover:text-primary",
                )}
              >
                0{i + 1}. {item.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WorksWheel;

