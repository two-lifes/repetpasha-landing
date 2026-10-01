import { Badge } from "@/components/ui/badge";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import {
  PricingFormatToggle,
  PricingGrid,
  type PricingTabKey,
} from "@/components/ui/pricing-grid";
import { useState } from "react";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { useContent } from "@/context/ContentContext";
import { LEAD_FORM_ID } from "@/lib/site-config";
import { ClipboardCheck, MessageCircle, ShieldCheck } from "lucide-react";

const STANDARD_ICONS = {
  audit: ClipboardCheck,
  hours: ShieldCheck,
  chat: MessageCircle,
} as const;

export function PricingCards() {
  const { pricing } = useContent();
  const [formatTab, setFormatTab] = useState<PricingTabKey>("individual");
  const plans =
    formatTab === "individual" ? pricing.plansIndividual : pricing.plansGroup;

  return (
    <section
      id="pricing"
      className="dark relative z-10 bg-zinc-950 py-12 text-foreground lg:py-24 xl:py-[160px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col gap-11">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge
                variant="outline"
                className="border-white/[0.06] bg-transparent px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase"
              >
                {pricing.badge}
              </Badge>
              <TextRevealByWord
                text={pricing.title}
                className="text-[clamp(1.875rem,4vw,2.25rem)] md:text-4xl"
              />
              <TextGradientScroll
                text={pricing.subtitle}
                className="text-lg leading-relaxed text-muted-foreground"
                textOpacity="medium"
              />
            </div>
            <PricingFormatToggle
              tab={formatTab}
              onTabChange={setFormatTab}
              individualLabel={pricing.tabIndividual}
              groupsLabel={pricing.tabGroups}
            />
          </div>

          <PricingGrid plans={plans} />

          <div className="grid gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900/30 p-6 md:grid-cols-3 md:p-8">
            {pricing.standards.map((item) => {
              const Icon = STANDARD_ICONS[item.key];
              return (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                    <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{item.body}</p>
                </div>
              );
            })}
          </div>

          <div className="flex lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:bg-zinc-900/30 lg:p-8">
            <p className="hidden max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base lg:block">
              {pricing.footerText}
            </p>
            <ButtonWithIcon href={`#${LEAD_FORM_ID}`} className="shrink-0">
              {pricing.footerCta}
            </ButtonWithIcon>
          </div>
        </div>
      </div>
    </section>
  );
}
