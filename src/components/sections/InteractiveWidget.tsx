import { CheckCircle2, FileEdit, MonitorPlay, Sparkles } from "lucide-react";
import { AgentTrace, type TraceSpan } from "@/components/ui/agent-trace";

const MINUTE = 1000;

const WEEK_SPANS: TraceSpan[] = [
  {
    id: "monday",
    label: "Разбор алгоритма",
    kind: "agent",
    icon: MonitorPlay,
    start: 0,
    end: 90 * MINUTE,
    detail: "Пн · Zoom и Miro",
  },
  {
    id: "quizlet",
    label: "Закрепление в Quizlet",
    kind: "tool",
    icon: Sparkles,
    start: 90 * MINUTE,
    end: 105 * MINUTE,
    detail: "Вт—Ср · 15 мин в день",
  },
  {
    id: "thursday",
    label: "Боевая практика",
    kind: "io",
    icon: FileEdit,
    start: 105 * MINUTE,
    end: 175 * MINUTE,
    detail: "Чт · Google Docs",
  },
  {
    id: "friday",
    label: "Экспертный аудит",
    kind: "model",
    icon: CheckCircle2,
    start: 175 * MINUTE,
    end: 220 * MINUTE,
    detail: "Пт · критерии К1–К5",
  },
];

function formatStudyTime(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / MINUTE));
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`;
}

export function InteractiveWidget() {
  return (
    <AgentTrace
      spans={WEEK_SPANS}
      runId="Спринт"
      formatTime={formatStudyTime}
      showTokens={false}
      showTransport={false}
      followScroll
      autoPlay={false}
      labelWidth={228}
      rowHeight={42}
      labels={{
        summary: "Пн — Пт · четыре этапа",
        running: "Идёт",
        complete: "Пройдена",
        play: "Смотреть неделю",
        pause: "Пауза",
        playhead: "Ход недели",
        spans: "Этапы:",
      }}
      className="shadow-none"
    />
  );
}
