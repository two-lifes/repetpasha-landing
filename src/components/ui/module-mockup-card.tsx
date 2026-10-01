import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ModuleMockupType =
  | "essay_38"
  | "email_37"
  | "speaking_4"
  | "speaking_3"
  | "grammar_19_24"
  | "word_formation_25_29"
  | "lexicon_30_36"
  | "listening_1_9"
  | "reading_10_18";

const GOOD_TEXT = "text-[#A8C9BB]";
const GOOD_BG = "bg-[#A8C9BB]/10";
const BAD_TEXT = "text-[#C9937E]";

type ModuleMockupCardProps = {
  type: ModuleMockupType;
  className?: string;
};

export function ModuleMockupCard({ type, className }: ModuleMockupCardProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full select-none flex-col gap-4 overflow-hidden bg-[#161618] p-5 text-left font-sans text-zinc-100 antialiased",
        className,
      )}
    >
      {type === "essay_38" && <EssayMockup />}
      {type === "email_37" && <EmailMockup />}
      {type === "speaking_4" && <Speaking4Mockup />}
      {type === "speaking_3" && <Speaking3Mockup />}
      {type === "grammar_19_24" && <GrammarMockup />}
      {type === "word_formation_25_29" && <WordFormationMockup />}
      {type === "lexicon_30_36" && <LexiconMockup />}
      {type === "listening_1_9" && <ListeningMockup />}
      {type === "reading_10_18" && <ReadingMockup />}
    </div>
  );
}

function Header({
  caption,
  title,
  meta,
}: {
  caption: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-500">{caption}</p>
        <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-zinc-100">
          {title}
        </p>
      </div>
      {meta ? (
        <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-zinc-400">
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function Group({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "divide-y divide-white/[0.06] overflow-hidden rounded-xl bg-white/[0.04]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-3 py-2 text-[13px] leading-snug", className)}>{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <p className="mt-auto truncate text-xs text-zinc-500">{children}</p>;
}

function Check() {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full",
        GOOD_BG,
        GOOD_TEXT,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="size-2.5">
        <path
          d="M2.5 6.2 5 8.5l4.5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Waveform({ played }: { played: number }) {
  const bars = [5, 9, 6, 13, 8, 11, 15, 9, 12, 7, 14, 10, 6, 11, 7, 12, 8, 5, 10, 6];
  const cut = Math.round(bars.length * played);
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full", i < cut ? "bg-[#A8C9BB]" : "bg-white/20")}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

const EssayMockup = () => (
  <>
    <Header caption="Задание 38" title="Сравнение данных" meta="К2 · Организация" />
    <Group>
      <Row className="text-zinc-400">
        <span className={cn("mb-0.5 block text-[11px] font-medium", BAD_TEXT)}>Было</span>
        <span className="line-through decoration-[#C9937E]/60">
          Also they play games (31%). Games are less popular.
        </span>
      </Row>
      <Row className="text-zinc-100">
        <span className={cn("mb-0.5 block text-[11px] font-medium", GOOD_TEXT)}>Стало</span>
        In contrast, playing games lags behind by 11 percentage points.
      </Row>
    </Group>
    <Footer>Контрастная связка и точная разница в цифрах</Footer>
  </>
);

const EmailMockup = () => (
  <>
    <Header caption="Задание 37" title="Письмо другу" meta="6 из 6" />
    <Group>
      <Row className="flex items-center gap-2.5 text-zinc-200">
        <Check />
        Thanks for your email!
      </Row>
      <Row className="flex items-center gap-2.5 text-zinc-200">
        <Check />
        Ответы на три вопроса друга
      </Row>
      <Row className="flex items-center gap-2.5 text-zinc-200">
        <Check />
        Три своих вопроса по теме письма
      </Row>
      <Row className="flex items-center gap-2.5 text-zinc-200">
        <Check />
        Завершающая фраза и подпись
      </Row>
    </Group>
    <Footer>Неофициальный стиль, 100–140 слов</Footer>
  </>
);

const Speaking4Mockup = () => (
  <>
    <Header caption="Устная часть · 4" title="Сравнение двух фото" meta="3:00" />
    <div className="grid grid-cols-2 gap-2">
      <div className="flex h-12 items-center justify-center rounded-xl bg-white/[0.05] text-xs text-zinc-500">
        Фото 1
      </div>
      <div className="flex h-12 items-center justify-center rounded-xl bg-white/[0.05] text-xs text-zinc-500">
        Фото 2
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs tabular-nums text-zinc-400">1:45</span>
      <Waveform played={0.58} />
    </div>
    <Footer>Both photos are relevant because they depict…</Footer>
  </>
);

const Speaking3Mockup = () => (
  <>
    <Header caption="Устная часть · 3" title="Интервью" meta="40 сек" />
    <p className="rounded-xl bg-white/[0.05] px-3 py-2 text-[13px] leading-snug text-zinc-300">
      Why do teens spend so much time online?
    </p>
    <Group>
      <Row className="text-zinc-200">
        <span className="mr-1.5 text-zinc-500 tabular-nums">1</span>
        The Web is their main source of fun.
      </Row>
      <Row className="text-zinc-200">
        <span className="mr-1.5 text-zinc-500 tabular-nums">2</span>
        Social apps let them stay in touch.
      </Row>
      <Row className="text-zinc-200">
        <span className="mr-1.5 text-zinc-500 tabular-nums">3</span>
        That is why going offline feels hard.
      </Row>
    </Group>
    <Footer>Ответ, развитие, вывод — без пауз</Footer>
  </>
);

const GrammarMockup = () => (
  <>
    <Header caption="Задания 19–24" title="Грамматика" meta="Алгоритм" />
    <p className="text-[13px] leading-snug text-zinc-300">
      If I{" "}
      <span className={cn("rounded-md px-1.5 py-0.5 font-medium", GOOD_BG, GOOD_TEXT)}>
        had
      </span>{" "}
      more time, I would call.
    </p>
    <Group>
      <Row className="flex justify-between gap-2 text-zinc-400">
        <span>Маркер</span>
        <span className="text-zinc-200">would call</span>
      </Row>
      <Row className="flex justify-between gap-2 text-zinc-400">
        <span>Тип</span>
        <span className="text-zinc-200">Conditional II</span>
      </Row>
      <Row className="flex justify-between gap-2 text-zinc-400">
        <span>Форма</span>
        <span className={GOOD_TEXT}>Past Simple</span>
      </Row>
    </Group>
    <Footer>Три шага вместо угадывания</Footer>
  </>
);

const WordFormationMockup = () => (
  <>
    <Header caption="Задания 25–29" title="Словообразование" meta="PREDICT" />
    <p className="text-[13px] leading-snug text-zinc-300">
      The weather was completely ______.
    </p>
    <div className="flex items-center gap-1.5 text-[13px]">
      <span className={cn("rounded-lg px-2 py-1", GOOD_BG, GOOD_TEXT)}>un</span>
      <span className="text-zinc-600">+</span>
      <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-zinc-200">predict</span>
      <span className="text-zinc-600">+</span>
      <span className={cn("rounded-lg px-2 py-1", GOOD_BG, GOOD_TEXT)}>able</span>
    </div>
    <p className="text-[15px] font-semibold tracking-tight text-zinc-100">unpredictable</p>
    <Footer>Нужно прилагательное с отрицанием</Footer>
  </>
);

const LexiconMockup = () => (
  <>
    <Header caption="Задания 30–36" title="Лексика" meta="Синонимы" />
    <p className="text-[13px] leading-snug text-zinc-300">
      Could you ___ me the way to the station?
    </p>
    <Group>
      <Row className="flex justify-between gap-2 text-zinc-500">
        <span>say</span>
        <span>say something</span>
      </Row>
      <Row className={cn("flex justify-between gap-2", GOOD_BG)}>
        <span className={cn("font-medium", GOOD_TEXT)}>tell</span>
        <span className="text-zinc-300">tell somebody</span>
      </Row>
      <Row className="flex justify-between gap-2 text-zinc-500">
        <span>speak</span>
        <span>speak to somebody</span>
      </Row>
      <Row className="flex justify-between gap-2 text-zinc-500">
        <span>talk</span>
        <span>talk about</span>
      </Row>
    </Group>
    <Footer>Выбор решает конструкция, а не перевод</Footer>
  </>
);

const ListeningMockup = () => (
  <>
    <Header caption="Задания 1–9" title="Аудирование" meta="Дистрактор" />
    <div className="flex items-center gap-3">
      <span className="text-xs tabular-nums text-zinc-400">0:42</span>
      <Waveform played={0.4} />
    </div>
    <p className="text-[13px] leading-relaxed text-zinc-300">
      I considered{" "}
      <span className="text-zinc-500 line-through decoration-[#C9937E]">Spain</span> at first,
      but eventually booked{" "}
      <span className={cn("rounded-md px-1.5 py-0.5 font-medium", GOOD_BG, GOOD_TEXT)}>
        Greece
      </span>
      .
    </p>
    <Footer>«Eventually» отменяет первый вариант</Footer>
  </>
);

const ReadingMockup = () => (
  <>
    <Header caption="Задания 10–18" title="Чтение" meta="Задание 11" />
    <p className="text-[13px] leading-snug text-zinc-300">
      The old library, ______, is now a museum.
    </p>
    <Group>
      <Row className="flex gap-2.5 text-zinc-500">
        <span className="tabular-nums">A</span>
        <span className="line-through decoration-[#C9937E]/60">who built it in 1890</span>
      </Row>
      <Row className={cn("flex gap-2.5", GOOD_BG)}>
        <span className={cn("font-medium tabular-nums", GOOD_TEXT)}>B</span>
        <span className="text-zinc-200">which opened in 1890</span>
      </Row>
    </Group>
    <Footer>Фрагмент подбираем по грамматике, а не по смыслу слов</Footer>
  </>
);
