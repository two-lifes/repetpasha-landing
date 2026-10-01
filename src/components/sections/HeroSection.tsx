import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motionPresets";
import { LEAD_FORM_ID } from "@/lib/site-config";

export function HeroSection() {
  const { hero } = useContent();
  return (
    <section className="relative z-10 flex min-h-screen items-end">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/media/banner-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 pb-10 lg:gap-[1.5rem] lg:pb-10">
          <div className="grid items-end gap-8 xl:grid-cols-12 xl:gap-10">
            <motion.div
              className="xl:col-span-4"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={fadeUpTransition(100)}
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/primary-leaf.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 animate-spin motion-reduce:animate-none"
                  aria-hidden
                />
                <h1 className="mb-0 text-[18px] font-normal leading-relaxed text-white/70">
                  {hero.introBefore}{" "}
                  <span className="text-primary-light">{hero.introHighlight}</span>{" "}
                  {hero.introAfter}
                </h1>
              </div>
            </motion.div>

            <motion.div
              className="xl:col-span-4 xl:col-start-9"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={fadeUpTransition(150)}
            >
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-sm">
                <img
                  src="/images/teacher-placeholder.jpg"
                  alt={hero.photoAlt}
                  width={480}
                  height={360}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-wrap items-end gap-3"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={fadeUpTransition(200)}
          >
            <p className="mb-0 max-w-full text-[clamp(3.5rem,14vw,8rem)] font-bold leading-none text-white">
              {hero.title}
            </p>
            <a
              href={`#${LEAD_FORM_ID}`}
              className="group inline-flex items-center rounded-full bg-primary py-1 pe-1 ps-7 transition-colors hover:bg-secondary"
              aria-label={hero.ctaLabel}
            >
              <span className="flex size-[52px] items-center justify-center rounded-full bg-white transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-7 text-dark" strokeWidth={2} />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
