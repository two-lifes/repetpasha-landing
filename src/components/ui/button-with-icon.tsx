import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonWithIconProps = {
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string;
};

const iconButtonClassName =
  "group relative h-14 w-fit cursor-pointer overflow-hidden rounded-full p-1.5 ps-8 pe-[4.5rem] text-base font-semibold transition-all duration-500 hover:bg-primary/90 hover:ps-[4.5rem] hover:pe-8";

export function ButtonWithIcon({
  href,
  target,
  rel,
  children,
  className,
}: ButtonWithIconProps) {
  const mergedClassName = cn(iconButtonClassName, className);

  const inner = (
    <>
      <span className="relative z-10 transition-all duration-500">
        {children}
      </span>
      <span
        className="absolute right-1.5 flex size-11 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-3.125rem)] group-hover:rotate-45"
        aria-hidden
      >
        <ArrowUpRight size={20} strokeWidth={2} />
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <Button asChild className={mergedClassName}>
        <a href={href} target={target} rel={rel}>
          {inner}
        </a>
      </Button>
    );
  }

  return <Button className={mergedClassName}>{inner}</Button>;
}
