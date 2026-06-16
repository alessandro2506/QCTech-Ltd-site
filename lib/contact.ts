/** Valori `topic` accettati da form e API (allineati alla query string). */
export const CONTACT_TOPICS = ["web", "mobile", "ecommerce", "presence", "other"] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export function isContactTopic(v: string): v is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(v);
}

export function sanitizeText(
  value: unknown,
  maxLen: number,
): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t || t.length > maxLen) return null;
  return t;
}
