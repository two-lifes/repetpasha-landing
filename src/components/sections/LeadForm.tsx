import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowField } from "@/components/ui/glow-field";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { useContent } from "@/context/ContentContext";
import {
  formatRuPhoneInput,
  formatTelegramInput,
  isValidRuPhone,
  isValidTelegramUsername,
} from "@/lib/contact-format";
import { LEAD_FORM_ENDPOINT, LEAD_FORM_ID, TELEGRAM_HREF } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { type FormEvent, useState } from "react";

type GradeValue = "10" | "11" | "graduate";

const CHIP_CLASS =
  "rounded-full border px-4 py-2 text-sm font-medium transition-colors";

function chipClassName(selected: boolean): string {
  return cn(
    CHIP_CLASS,
    selected
      ? "border-zinc-100 bg-zinc-100 text-zinc-900"
      : "border-white/[0.08] bg-zinc-900/50 text-zinc-300 hover:border-white/15 hover:text-zinc-100",
  );
}

function resolveTelegramHref(fromContent: string, fallback: string): string {
  const value = fromContent.trim();
  if (!value) {
    return fallback;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://t.me/${value.replace(/^@/, "")}`;
}

function telegramHandle(href: string): string {
  const match = href.match(/t\.me\/([A-Za-z0-9_]+)/);
  if (match?.[1]) {
    return `@${match[1]}`;
  }
  return "@username";
}

function formatContactInput(value: string): string {
  if (!value.trim()) {
    return "";
  }
  if (/[a-zA-Z@]/.test(value)) {
    return formatTelegramInput(value);
  }
  return formatRuPhoneInput(value);
}

function isValidContact(value: string): boolean {
  if (/[a-zA-Z@]/.test(value)) {
    return isValidTelegramUsername(value);
  }
  return isValidRuPhone(value);
}

export function LeadForm() {
  const { leadForm, meta } = useContent();
  const telegramHref = resolveTelegramHref(meta.telegramUrl, TELEGRAM_HREF);
  const handle = telegramHandle(telegramHref);
  const [noteBefore, noteAfter] = leadForm.directNote.split("{handle}");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [grade, setGrade] = useState<GradeValue | "">("");
  const [gradeError, setGradeError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!grade) {
      setGradeError(true);
      return;
    }
    setGradeError(false);

    const contactTrimmed = contact.trim();
    if (!isValidContact(contactTrimmed)) {
      setContactError(leadForm.contactError);
      return;
    }
    setContactError(null);

    setPending(true);

    const payload = {
      name: name.trim(),
      contact: contactTrimmed,
      grade: leadForm.grades.find((item) => item.value === grade)?.label ?? grade,
    };

    try {
      if (LEAD_FORM_ENDPOINT) {
        const response = await fetch(LEAD_FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("submit_failed");
        }
      } else {
        const text = [
          leadForm.messageHeader,
          `Имя: ${payload.name}`,
          `Контакт: ${payload.contact}`,
          `Класс: ${payload.grade}`,
        ].join("\n");
        window.open(
          `${telegramHref}?text=${encodeURIComponent(text)}`,
          "_blank",
          "noopener,noreferrer",
        );
      }
      setSubmitted(true);
    } catch {
      setSubmitError(leadForm.submitError);
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id={LEAD_FORM_ID}
      className="dark relative z-10 scroll-mt-28 bg-zinc-950 py-12 text-foreground lg:py-24 xl:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/90">
          <div className="grid lg:grid-cols-2">
            <div className="space-y-8 border-b border-white/[0.06] p-6 lg:border-r lg:border-b-0 xl:p-12">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="border-white/[0.06] bg-transparent px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase"
                >
                  {leadForm.badge}
                </Badge>
                <TextRevealByWord
                  text={leadForm.title}
                  reveal="inView"
                  className="text-[clamp(1.875rem,4vw,2.5rem)] md:text-4xl"
                />
                <p className="text-lg leading-relaxed text-zinc-400">{leadForm.subtitle}</p>
              </div>

              <ul className="space-y-3">
                {leadForm.valuePoints.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-snug text-zinc-300">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <p className="text-sm leading-relaxed text-zinc-400">
                {noteBefore ?? leadForm.directNote}
                {noteAfter !== undefined ? (
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 underline-offset-2 hover:underline"
                  >
                    {handle}
                  </a>
                ) : null}
                {noteAfter}
              </p>
            </div>

            <div className="p-6 xl:p-12">
              {submitted ? (
                <div className="flex min-h-[280px] flex-col justify-center gap-3">
                  <p className="text-lg font-semibold text-zinc-50">{leadForm.successTitle}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {LEAD_FORM_ENDPOINT
                      ? leadForm.successWithEndpoint
                      : leadForm.successWithoutEndpoint}
                  </p>
                </div>
              ) : (
                <form className="space-y-2" onSubmit={handleSubmit} noValidate>
                  <GlowField
                    id="lead-name"
                    name="name"
                    label={leadForm.nameLabel}
                    hint={leadForm.nameHint}
                    type="text"
                    autoComplete="name"
                    placeholder={leadForm.namePlaceholder}
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />

                  <GlowField
                    id="lead-contact"
                    name="contact"
                    label={leadForm.contactLabel}
                    type="text"
                    autoComplete="tel"
                    placeholder={leadForm.contactPlaceholder}
                    required
                    value={contact}
                    onChange={(event) => {
                      setContact(formatContactInput(event.target.value));
                      setContactError(null);
                    }}
                    className="mt-8"
                  />
                  {contactError ? (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {contactError}
                    </p>
                  ) : null}

                  <fieldset className="mt-8 space-y-3">
                    <legend className="text-sm font-medium text-zinc-300">
                      {leadForm.gradeLegend}
                    </legend>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-required="true"
                      aria-invalid={gradeError}
                    >
                      {leadForm.grades.map((option) => {
                        const selected = grade === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              setGrade(option.value);
                              setGradeError(false);
                            }}
                            className={chipClassName(selected)}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    {gradeError ? (
                      <p className="text-xs text-destructive">{leadForm.gradeError}</p>
                    ) : null}
                  </fieldset>

                  {submitError ? (
                    <p className="mt-4 text-sm text-destructive" role="alert">
                      {submitError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="mt-8 h-12 w-full rounded-full text-base font-semibold"
                    disabled={pending}
                  >
                    {pending ? leadForm.pendingLabel : leadForm.submitLabel}
                  </Button>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                    {leadForm.replyNote}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    <a
                      href="/privacy-policy.html"
                      className="underline decoration-white/20 underline-offset-2 hover:text-zinc-300"
                    >
                      Политика конфиденциальности
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
