import { motion } from "framer-motion";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { InteractiveWidget } from "@/components/sections/InteractiveWidget";
import { TextBlockAnimation } from "@/components/ui/text-block-animation";
import { fadeUpTransition, fadeUpVariants, viewportOnce } from "@/lib/motionPresets";
import { LEAD_FORM_ID } from "@/lib/site-config";

export function InteractiveWidgetSection() {
  return (
    <section
      id="sprint"
      className="dark relative z-10 bg-transparent py-12 text-foreground lg:py-24 xl:py-[160px]"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col gap-11 px-4 sm:px-6 lg:px-8">
        <div>
          <TextBlockAnimation blockColor="#7c9082" duration={0.7}>
            <h2 className="text-[clamp(1.875rem,4vw,2.25rem)] font-bold leading-tight md:text-4xl">
              Анатомия подготовки: как устроена учебная неделя
            </h2>
          </TextBlockAnimation>
          <TextBlockAnimation blockColor="#36443a" delay={0.05} duration={0.6} className="max-w-3xl">
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              Чёткий ритм вместо хаоса: 4 этапа каждого спринта от разбора темы до
              персонального аудита ошибок.
            </p>
          </TextBlockAnimation>
        </div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={fadeUpTransition(200)}
        >
          <InteractiveWidget />
        </motion.div>

        <motion.div
          className="flex flex-col gap-5 rounded-xl bg-light-gray px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={fadeUpTransition(300)}
        >
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Все материалы, записи разборов и статусы домашек фиксируются в едином
            Notion-пространстве ученика.
          </p>
          <ButtonWithIcon href={`#${LEAD_FORM_ID}`}>
            Записаться на вводную диагностику
          </ButtonWithIcon>
        </motion.div>
      </div>
    </section>
  );
}
