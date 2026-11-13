const PHONE_STEM =
  /chiamat|chiama|telefon|videochiamat|\bcalls?\b|\bcalling\b|\bcalled\b|\bphones?\b|\bphoning\b|\bphoned\b|\brings?\b|\bringing\b|\brang\b/i;

const PHONE_NUMBER =
  /\+\s*(?:39|44)(?:[\s./()-]*\d){6,}|\b0\d{1,4}[\s./-]\d{3,}(?:[\s./-]\d{2,})?/;

function splitSentences(text: string): string[] {
  const parts: string[] = [];
  let buffer = "";
  for (const char of text) {
    buffer += char;
    if (char === "." || char === "!" || char === "?") {
      const trimmed = buffer.trim();
      if (trimmed) parts.push(trimmed);
      buffer = "";
    }
  }
  const leftover = buffer.trim();
  if (leftover) parts.push(leftover);
  return parts;
}

export function sentenceSuggestsPhoneCall(sentence: string): boolean {
  return PHONE_STEM.test(sentence) || PHONE_NUMBER.test(sentence);
}

export function stripCallSuggestions(text: string): string {
  const kept = splitSentences(text).filter((sentence) => !sentenceSuggestsPhoneCall(sentence));
  return kept.join(" ").replace(/\s+/g, " ").trim();
}
