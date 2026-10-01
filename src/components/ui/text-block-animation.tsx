import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type TextBlockAnimationProps = {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  duration?: number;
  className?: string;
};

export function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#000",
  duration = 0.6,
  className,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const block = document.createElement("div");
      block.style.position = "absolute";
      block.style.inset = "0";
      block.style.backgroundColor = blockColor;
      block.style.zIndex = "2";
      block.style.transform = "scaleX(0)";
      block.style.transformOrigin = "left center";
      block.style.pointerEvents = "none";
      container.appendChild(block);
      gsap.set(content, { opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        delay,
        ...(animateOnScroll
          ? {
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          : {}),
      });

      timeline
        .to(block, {
          scaleX: 1,
          duration,
          transformOrigin: "left center",
        })
        .set(content, { opacity: 1 }, `<${duration / 2}`)
        .to(
          block,
          {
            scaleX: 0,
            duration,
            transformOrigin: "right center",
          },
          `<${duration * 0.4}`,
        );

      return () => {
        block.remove();
        gsap.set(content, { clearProps: "opacity" });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, duration],
    },
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
