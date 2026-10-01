import { useEffect, useState } from "react";

type UseTypewriterOptions = {
  text: string;
  speedMs?: number;
  startDelayMs?: number;
};

export function useTypewriter({
  text,
  speedMs = 42,
  startDelayMs = 600,
}: UseTypewriterOptions): string {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleLength((current) => {
          if (current >= text.length) {
            if (intervalId !== undefined) {
              clearInterval(intervalId);
            }
            return current;
          }
          return current + 1;
        });
      }, speedMs);
    }, startDelayMs);

    return () => {
      clearTimeout(startId);
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [text, speedMs, startDelayMs]);

  return text.slice(0, visibleLength);
}
