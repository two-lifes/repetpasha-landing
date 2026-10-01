import { motion } from "framer-motion";
import {
  fadeRightVariants,
  fadeUpTransition,
  viewportOnce,
} from "@/lib/motionPresets";

type SectionLabelProps = {
  index: string;
  badge: string;
};

export function SectionLabel({ index, badge }: SectionLabelProps) {
  return (
    <motion.div
      className="flex items-center gap-[30px] py-2"
      variants={fadeRightVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={fadeUpTransition(100)}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-medium text-primary">
        {index}
      </span>
      <span className="h-px w-16 shrink-0 bg-[rgba(31,42,46,0.12)]" aria-hidden />
      <span className="rounded-full bg-dark px-4 py-2 text-base font-medium text-white">
        {badge}
      </span>
    </motion.div>
  );
}
