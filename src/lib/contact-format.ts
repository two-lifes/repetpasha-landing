/** Нормализация цифр телефона РФ: 11 цифр, начинается с 7 */
export function normalizeRuPhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length > 0 && !digits.startsWith("7")) {
    digits = `7${digits}`;
  }
  return digits.slice(0, 11);
}

/** Отображение: +7 XXX XXX-XX-XX */
export function formatRuPhoneInput(value: string): string {
  const d = normalizeRuPhoneDigits(value);
  if (d.length === 0) {
    return "";
  }
  const rest = d.slice(1);
  let out = "+7";
  if (rest.length > 0) {
    out += ` ${rest.slice(0, 3)}`;
  }
  if (rest.length > 3) {
    out += ` ${rest.slice(3, 6)}`;
  }
  if (rest.length > 6) {
    out += `-${rest.slice(6, 8)}`;
  }
  if (rest.length > 8) {
    out += `-${rest.slice(8, 10)}`;
  }
  return out;
}

export function isValidRuPhone(value: string): boolean {
  return normalizeRuPhoneDigits(value).length === 11;
}

/** Username с одним @ в начале */
export function formatTelegramInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const body = trimmed.replace(/^@+/, "").replace(/\s/g, "");
  return `@${body}`;
}

export function isValidTelegramUsername(value: string): boolean {
  const body = value.replace(/^@+/, "");
  return body.length >= 4 && /^[a-zA-Z0-9_]+$/.test(body);
}
