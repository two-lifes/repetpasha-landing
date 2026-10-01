import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ListOrdered, Sheet, Target } from "lucide-react";

export type AboutPrincipleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  linkLabel: string;
  linkHref: string;
};

export const aboutPrincipleItems: AboutPrincipleItem[] = [
  {
    title: "Только ЕГЭ",
    description:
      "10–11 класс: письменная часть и устная. Общий курс «на все случаи» сюда не входит.",
    icon: Target,
    linkLabel: "Смотреть методику",
    linkHref: "#methodology",
  },
  {
    title: "Алгоритм вместо зубрёжки",
    description:
      "Сложные задания, включая 37 и 38, разбираются по шагам: что требует критерий и где типичная ошибка.",
    icon: ListOrdered,
    linkLabel: "Как устроена неделя",
    linkHref: "#sprint",
  },
  {
    title: "Один трекер на всех",
    description:
      "Ученик и родители смотрят одно и то же: что уже закрыто и что сейчас в работе. Notion или Google Sheets.",
    icon: Sheet,
    linkLabel: "Ритм спринта",
    linkHref: "#sprint",
  },
];

type AboutPrincipleCardsProps = {
  items?: AboutPrincipleItem[];
};

export function AboutPrincipleCards({
  items = aboutPrincipleItems,
}: AboutPrincipleCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.9", "start 0.45"],
  });

  return (
    <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const start = index / items.length;
        const end = start + 1 / items.length;

        return (
          <AboutPrincipleCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            linkLabel={item.linkLabel}
            linkHref={item.linkHref}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </div>
  );
}

type AboutPrincipleCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  linkLabel: string;
  linkHref: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function AboutPrincipleCard({
  title,
  description,
  icon: Icon,
  linkLabel,
  linkHref,
  progress,
  range,
}: AboutPrincipleCardProps) {
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
      <Card variant="soft" className="h-full border-0 p-6 shadow-none">
        <div className="relative flex h-full flex-col">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" strokeWidth={2} aria-hidden />
          </div>

          <div className="mt-6 flex flex-1 flex-col space-y-1.5">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="line-clamp-3 text-muted-foreground">{description}</p>
            <a
              href={linkHref}
              className="mt-auto pt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {linkLabel}
            </a>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
