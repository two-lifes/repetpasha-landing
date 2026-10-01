import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowField } from "@/components/ui/glow-field";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { LEAD_FORM_ENDPOINT, LEAD_FORM_ID, TELEGRAM_HREF } from "@/lib/site-config";
import {
  formatRuPhoneInput,
  formatTelegramInput,
  isValidRuPhone,
  isValidTelegramUsername,
} from "@/lib/contact-format";
import { useContent } from "@/context/ContentContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { type FormEvent, useState } from "react";

type GradeValue = "10" | "11" | "other";
type ContactMethod = "telegram" | "max" | "callback";

const CONTACT_INPUT_META: Record<
  ContactMethod,
  { autoComplete: string; inputMode: "text" | "tel" }
> = {
  telegram: { autoComplete: "username", inputMode: "text" },
  max: { autoComplete: "tel", inputMode: "tel" },
  callback: { autoComplete: "tel", inputMode: "tel" },
};

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

const FORM_BLOBS = Array.from({ length: 4 }, (_, index) => ({
  size: 140 + index * 40,
  left: 10 + index * 22,
  top: 15 + (index % 2) * 35,
  delay: index * -4,
}));

function FormBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
      aria-hidden
    >
      {FORM_BLOBS.map((blob, index) => (
        <div
          key={index}
          className="absolute animate-pulse rounded-full bg-gradient-to-br from-zinc-600/30 to-zinc-400/10 blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.left}%`,
            top: `${blob.top}%`,
            animationDelay: `${blob.delay}s`,
            animationDuration: "8s",
          }}
        />
      ))}
    </div>
  );
}

export function LeadForm() {
  const { leadForm, meta } = useContent();
  const telegramHref = resolveTelegramHref(meta.telegramUrl, TELEGRAM_HREF);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("telegram");
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
    if (contactMethod === "telegram") {
      if (!isValidTelegramUsername(contactTrimmed)) {
        setContactError(leadForm.telegramError);
        return;
      }
    } else if (!isValidRuPhone(contactTrimmed)) {
      setContactError(leadForm.phoneError);
      return;
    }
    setContactError(null);

    setPending(true);

    const payload = {
      name: name.trim(),
      contactMethod:
        leadForm.contactMethods.find((method) => method.value === contactMethod)?.label ??
        contactMethod,
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
          `Способ связи: ${payload.contactMethod}`,
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
          <div className="border-b border-white/[0.06] px-6 py-10 text-center lg:px-10">
            <Badge
              variant="outline"
              className="mb-4 border-white/[0.06] bg-transparent px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-400 uppercase"
            >
              {leadForm.badge}
            </Badge>
            <TextRevealByWord
              text={leadForm.title}
              reveal="inView"
              align="center"
              className="text-[clamp(1.875rem,4vw,2.5rem)] md:text-4xl lg:text-5xl"
            />
            <TextGradientScroll
              text={leadForm.subtitle}
              className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              textOpacity="medium"
            />
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="space-y-8 border-b border-white/[0.06] p-6 lg:border-r lg:border-b-0 xl:p-12">
              <p className="text-sm leading-relaxed text-zinc-400">{leadForm.aside}</p>
              <ul className="space-y-3">
                {leadForm.valuePoints.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-zinc-300">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100">{leadForm.directTitle}</p>
                  <p className="mt-0.5 text-xs leading-snug text-zinc-500">
                    {leadForm.directNote}
                  </p>
                </div>
                <Button
                  className="h-10 shrink-0 rounded-full px-5 text-sm font-semibold"
                  asChild
                >
                  <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                    {leadForm.directButton}
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative p-6 xl:p-12">
              <FormBackdrop />

              {submitted ? (
                <div className="relative flex min-h-[280px] flex-col justify-center gap-3 rounded-xl border border-white/[0.06] bg-zinc-900/30 p-8">
                  <p className="text-lg font-semibold text-zinc-50">{leadForm.successTitle}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {LEAD_FORM_ENDPOINT
                      ? leadForm.successWithEndpoint
                      : leadForm.successWithoutEndpoint}
                  </p>
                </div>
              ) : (
                <form className="relative space-y-2" onSubmit={handleSubmit} noValidate>
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
                    onChange={(e) => setName(e.target.value)}
                  />

                  <fieldset className="mt-6 space-y-3">
                    <legend className="text-sm font-medium text-zinc-300">
                      {leadForm.contactLegend}
                    </legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup">
                      {leadForm.contactMethods.map((option) => {
                        const selected = contactMethod === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              setContactMethod(option.value);
                              setContact("");
                              setContactError(null);
                            }}
                            className={chipClassName(selected)}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <GlowField
                    id="lead-contact"
                    name="contact"
                    label={leadForm.contactFields[contactMethod].label}
                    type="text"
                    autoComplete={CONTACT_INPUT_META[contactMethod].autoComplete}
                    inputMode={CONTACT_INPUT_META[contactMethod].inputMode}
                    placeholder={leadForm.contactFields[contactMethod].placeholder}
                    required
                    value={contact}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (contactMethod === "telegram") {
                        setContact(formatTelegramInput(raw));
                      } else {
                        setContact(formatRuPhoneInput(raw));
                      }
                      setContactError(null);
                    }}
                    onFocus={() => {
                      if (contactMethod === "telegram" && !contact) {
                        setContact("@");
                      }
                    }}
                    className="mt-6"
                  />
                  {contactError ? (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {contactError}
                    </p>
                  ) : null}

                  <fieldset className="mt-10 space-y-3">
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
                    <p className="text-sm text-destructive" role="alert">
                      {submitError}
                    </p>
                  ) : null}

                  <div className="relative mt-10">
                    <Button
                      type="submit"
                      className="relative z-[1] h-12 w-full rounded-full text-base font-semibold tracking-wide"
                      disabled={pending}
                    >
                      {pending ? leadForm.pendingLabel : leadForm.submitLabel}
                    </Button>
                    <div
                      className="pointer-events-none absolute inset-0 -z-0 scale-95 rounded-full bg-zinc-400/20 blur-xl transition-transform duration-500 hover:scale-100"
                      aria-hidden
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
