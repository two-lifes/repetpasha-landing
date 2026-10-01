const telegramUrl = import.meta.env.VITE_TELEGRAM_URL?.trim();
const telegramHandle =
  import.meta.env.VITE_TELEGRAM_USERNAME?.replace(/^@/, "") ?? "pavel_sharagulov";

export const LEAD_FORM_ID = "lead-form";
/** Якорь для CTA «диагностика» — та же секция, что и форма */
export const DIAGNOSTICS_ID = LEAD_FORM_ID;

export const TELEGRAM_HREF =
  telegramUrl && telegramUrl.length > 0
    ? telegramUrl
    : `https://t.me/${telegramHandle}`;

export const PRIVACY_POLICY_HREF = "/privacy-policy.html";

/** POST JSON { name, contact, grade }. Пусто — открывается Telegram с текстом заявки */
export const LEAD_FORM_ENDPOINT = import.meta.env.VITE_LEAD_FORM_ENDPOINT ?? "";

export function buildTelegramMessageUrl(text: string): string {
  return `${TELEGRAM_HREF}?text=${encodeURIComponent(text)}`;
}
