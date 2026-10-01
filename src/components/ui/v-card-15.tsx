import { LinkIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type VCard15Props = {
  label: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkHref: string;
};

export function VCard15({ label, description, icon: Icon, link, linkHref }: VCard15Props) {
  return (
    <Card
      variant="soft"
      className="h-full w-full rounded-xl bg-white/[0.045] p-0 shadow-none"
    >
      <CardContent className="flex h-full min-h-48 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
          <h3 className="text-base font-semibold leading-snug text-foreground">
            {label}
          </h3>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-5">
          <a
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-light"
            href={linkHref}
          >
            <LinkIcon aria-hidden="true" className="size-3 shrink-0" />
            {link}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default VCard15;
