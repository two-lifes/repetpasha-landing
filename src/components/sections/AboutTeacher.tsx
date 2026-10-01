import { AsciiImage } from "@/components/ui/ascii-image";
import { AboutPrincipleCards } from "@/components/ui/about-principle-cards";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";

export function AboutTeacher() {
  return (
    <section id="about" className="dark relative z-10 bg-transparent py-12 text-foreground lg:py-24 xl:py-[160px]">
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
          <div className="shrink-0">
            <AsciiImage
              src="/images/teacher-placeholder.jpg"
              alt="Павел Шарагулов за рабочим местом"
              width={220}
              height={276}
              charSize={5}
              className="rounded-xl"
              mask="linear-gradient(to bottom, black 40%, transparent 100%)"
              baseMask="linear-gradient(to bottom, transparent 35%, black 100%)"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-primary">Павел Шарагулов</p>
            <div className="max-w-5xl">
              <TextRevealByWord
                text="Английский разбираю как систему, ЕГЭ — как техническое задание"
                className="mt-3 text-[clamp(1.875rem,4vw,2.25rem)] md:text-4xl"
              />
              <TextGradientScroll
                text="Я программист. Задания КИМ смотрю так же, как спецификацию: что требуется, в каком порядке и где обычно ломается ответ. Критерии ФИПИ здесь и есть требования к результату."
                className="mt-3 text-lg leading-relaxed text-muted-foreground"
                textOpacity="medium"
              />
            </div>

            <div className="mt-10">
              <AboutPrincipleCards />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
