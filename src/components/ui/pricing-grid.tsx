import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAD_FORM_ID } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { PricingPlanContent } from "@/types/content";

const pricingBorder = "border-white/[0.06]";

export type PricingPlan = PricingPlanContent;


type TabKey = "individual" | "groups";

const ctaClassName =
  "h-10 min-h-10 w-full shrink-0 rounded-full font-semibold";

function PlanCard({ plan }: { plan: PricingPlan }) {
  const isFeatured = Boolean(plan.featuredLabel);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-zinc-950/50 p-5",
        pricingBorder,
        isFeatured && "bg-zinc-900/40",
      )}
    >
      {plan.featuredLabel ? (
        <span
          className={cn(
            "absolute top-5 right-5 z-10 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase",
            pricingBorder,
          )}
        >
          {plan.featuredLabel}
        </span>
      ) : null}

      <div className={cn("space-y-1", plan.featuredLabel && "pe-32")}>
        <h3 className="text-xl font-bold tracking-tight text-zinc-50">{plan.name}</h3>
      </div>

      <div className="mt-4 space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-bold tracking-tight text-zinc-50">
            {plan.price}
          </span>
          {plan.priceUnit ? (
            <span className="text-lg font-medium text-zinc-400">{plan.priceUnit}</span>
          ) : null}
          {plan.originalPrice ? (
            <span className="text-sm text-zinc-500">
              (вместо{" "}
              <span className="line-through">{plan.originalPrice}</span>)
            </span>
          ) : null}
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">{plan.priceNote}</p>
      </div>

      <p className="mt-4 text-sm leading-snug text-zinc-400">{plan.description}</p>

      <ul className="mt-6 flex-1 space-y-2.5 border-t pt-5 border-white/[0.06]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-snug text-zinc-300">
            <Check
              className="mt-0.5 size-4 shrink-0 text-zinc-500"
              strokeWidth={2}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          ctaClassName,
          "mt-6",
          plan.ctaPrimary
            ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            : "border border-white/[0.06] bg-zinc-800/80 text-zinc-100 hover:bg-zinc-800",
        )}
        asChild
      >
        <a href={`#${LEAD_FORM_ID}`}>{plan.ctaLabel}</a>
      </Button>
    </div>
  );
}

export type PricingTabKey = TabKey;

type PricingFormatToggleProps = {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
  individualLabel: string;
  groupsLabel: string;
  className?: string;
};

export function PricingFormatToggle({
  tab,
  onTabChange,
  individualLabel,
  groupsLabel,
  className,
}: PricingFormatToggleProps) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 items-center gap-0.5 rounded-full border bg-zinc-900/40 p-1 sm:w-auto",
        pricingBorder,
        className,
      )}
      role="tablist"
      aria-label="Формат занятий"
    >
      {(
        [
          ["individual", individualLabel],
          ["groups", groupsLabel],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={tab === key}
          onClick={() => onTabChange(key)}
          className={cn(
            "rounded-full px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
            tab === key
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type PricingGridProps = {
  plans: PricingPlan[];
  className?: string;
};

export function PricingGrid({ plans, className }: PricingGridProps) {

  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        role="tabpanel"
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
