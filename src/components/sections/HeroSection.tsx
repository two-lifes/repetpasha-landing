import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HeroMeshGradient } from "@/components/ui/hero-mesh-gradient";
import { useContent } from "@/context/ContentContext";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motionPresets";
import { LEAD_FORM_ID } from "@/lib/site-config";

export function HeroSection() {
  const { hero } = useContent();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 flex min-h-screen items-center bg-[#0a0a0a] xl:items-end">
      <HeroMeshGradient />

      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 xl:hidden">
        <motion.a
          href="#methodology"
          aria-label="К методике подготовки"
          className="block text-white/40 transition-colors hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
          initial={{ opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 8, 0] }}
          transition={
            reduceMotion
              ? { duration: 0.6, delay: 0.35 }
              : {
                  opacity: { duration: 0.6, delay: 0.35 },
                  y: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.35,
                  },
                }
          }
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden
            className="size-8"
          >
            <path
              d="M16 24 L32 40 L48 24"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 py-10 xl:gap-6 xl:py-0 xl:pb-10">
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
                  {hero.introBefore}
                  {hero.introHighlight ? (
                    <>
                      {" "}
                      <span className="text-primary-light">{hero.introHighlight}</span>
                    </>
                  ) : null}
                  {hero.introAfter ? <> {hero.introAfter}</> : null}
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
              <div className="hidden overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-sm xl:block">
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
