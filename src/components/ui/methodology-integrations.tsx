import { useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollFade } from "@/components/ui/scroll-fade";
import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, RefreshCw, Sheet } from "lucide-react";
export type MethodologyItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const methodologyItems: MethodologyItem[] = [
  {
    title: "Диагностика",
    description:
      "На старте разбираем текущий уровень и типичные ошибки по критериям ФИПИ",
    icon: ClipboardCheck,
  },
  {
    title: "Трекинг",
    description:
      "Прогресс фиксируется: ученик и родители видят, что уже закрыто и что в работе.",
    icon: Sheet,
  },
  {
    title: "Спринты",
    description:
      "Короткие циклы на неделю — цель, практика, проверка, корректировка.",
    icon: RefreshCw,
  },
];

type MethodologyIntegrationsProps = {
  items?: MethodologyItem[];
};

export function MethodologyIntegrations({
  items = methodologyItems,
}: MethodologyIntegrationsProps) {
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
          <MethodologyIntegrationCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </div>
  );
}

type MethodologyIntegrationCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  progress: MotionValue<number>;
  range: [number, number];
};

function MethodologyIntegrationCard({
  title,
  description,
  icon: Icon,
  progress,
  range,
}: MethodologyIntegrationCardProps) {
  return (
    <ScrollFade progress={progress} range={range}>
      <Card variant="soft" className="h-full border-0 p-6 shadow-none">
        <div className="relative">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" strokeWidth={2} aria-hidden />
          </div>

          <div className="mt-6 space-y-1.5">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="line-clamp-3 text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </ScrollFade>
  );
}
