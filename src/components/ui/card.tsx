import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl text-card-foreground", {
  variants: {
    variant: {
      default: "border border-[rgba(31,42,46,0.12)] bg-card shadow-sm",
      soft: "border-0 bg-light-gray shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}
