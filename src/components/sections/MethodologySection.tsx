import { motion } from "framer-motion";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { MethodologyIntegrations } from "@/components/ui/methodology-integrations";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import {
  fadeUpTransition,
  fadeUpVariants,
  viewportOnce,
} from "@/lib/motionPresets";
import { LEAD_FORM_ID } from "@/lib/site-config";

export function MethodologySection() {
  return (
    <section
      id="methodology"
      className="dark relative z-10 bg-transparent py-12 text-foreground lg:py-24 xl:py-[160px]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col gap-11">
            <div className="max-w-5xl">
              <TextRevealByWord
                text="Системная подготовка, которую видно на каждом занятии"
                className="text-[clamp(1.875rem,4vw,2.25rem)] md:text-4xl"
              />
              <TextGradientScroll
                text="ЕГЭ по английскому — задача с чёткими критериями. Понятный старт, прозрачный прогресс и регулярная обратная связь для ученика и родителей."
                className="mt-3 text-lg leading-relaxed text-muted-foreground"
                textOpacity="medium"
              />
            </div>

            <MethodologyIntegrations />

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={fadeUpTransition(500)}
            >
              <ButtonWithIcon href={`#${LEAD_FORM_ID}`}>
                Записаться на диагностику
              </ButtonWithIcon>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
