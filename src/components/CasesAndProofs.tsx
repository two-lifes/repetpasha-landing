import { Badge } from "@/components/ui/badge";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import {
  WorksWheel,
  type WorksWheelItem,
} from "@/components/ui/works-wheel";
import { useContent } from "@/context/ContentContext";

export function CasesAndProofs() {
  const { cases, wheelModules } = useContent();
  const items: WorksWheelItem[] = wheelModules.map((module) => ({
    title: module.title,
    comment: module.comment,
    mockupType: module.mockupType,
    href: module.link,
  }));

  return (
    <section
      id="cases"
      className="dark relative z-10 bg-transparent py-12 text-foreground lg:py-24 xl:py-[160px]"
    >
      <div className="relative z-10 mx-auto mb-20 w-full max-w-[1680px] px-4 sm:mb-24 sm:px-6 lg:mb-32 lg:px-8 xl:mb-40">
        <div className="max-w-5xl space-y-4">
          <Badge
            variant="outline"
            className="border-border bg-transparent px-3 py-1 text-xs font-medium"
          >
            {cases.badge}
          </Badge>
          <TextRevealByWord
            text={cases.title}
            className="text-[clamp(1.875rem,4vw,2.25rem)] md:text-4xl"
          />
          <TextGradientScroll
            text={cases.subtitle}
            className="text-lg leading-relaxed text-muted-foreground"
            textOpacity="medium"
          />
        </div>
      </div>

      <WorksWheel
        items={items}
        label={cases.wheelLabel}
        action={cases.wheelAction}
        className="mt-4 sm:mt-6 lg:mt-8"
      />
    </section>
  );
}
