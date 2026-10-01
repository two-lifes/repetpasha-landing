import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { useContent } from "@/context/ContentContext";
import { LEAD_FORM_ID } from "@/lib/site-config";

export function FaqAccordion() {
  const { faq } = useContent();

  return (
    <section
      id="faq"
      className="dark relative z-10 bg-[#0a0a0a] py-12 text-foreground lg:py-24 xl:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="space-y-4 text-center sm:text-left">
            <Badge
              variant="outline"
              className="border-white/[0.06] bg-transparent px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase"
            >
              {faq.badge}
            </Badge>
            <TextRevealByWord
              text={faq.title}
              className="text-[clamp(1.875rem,4vw,2.25rem)] md:text-4xl"
            />
            <TextGradientScroll
              text={faq.subtitle}
              className="text-lg leading-relaxed text-muted-foreground"
              textOpacity="medium"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faq.items.map((item, index) => (
              <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="text-zinc-100">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:rounded-2xl lg:border lg:border-white/[0.06] lg:bg-zinc-900/30 lg:p-8">
            <p className="hidden text-sm leading-relaxed text-zinc-400 sm:text-base lg:block">
              {faq.footerText}
            </p>
            <ButtonWithIcon href={`#${LEAD_FORM_ID}`} className="shrink-0">
              {faq.footerCta}
            </ButtonWithIcon>
          </div>
        </div>
      </div>
    </section>
  );
}
