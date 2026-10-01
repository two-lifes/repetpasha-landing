export const SITE_URL = (
  import.meta.env.VITE_SITE_URL?.trim() || "https://repetpasha.ru"
).replace(/\/$/, "");

const telegramUrl = import.meta.env.VITE_TELEGRAM_URL?.trim();
const telegramHandle =
  import.meta.env.VITE_TELEGRAM_USERNAME?.replace(/^@/, "") ?? "pavel_sharagulov";

export const LEAD_FORM_ID = "lead-form";

export const TELEGRAM_HREF =
  telegramUrl && telegramUrl.length > 0
    ? telegramUrl
    : `https://t.me/${telegramHandle}`;

/** POST JSON { name, contact, grade }. Пусто — открывается Telegram с текстом заявки */
export const LEAD_FORM_ENDPOINT = import.meta.env.VITE_LEAD_FORM_ENDPOINT ?? "";
