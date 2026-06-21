/** Strips angle brackets and control characters, collapses whitespace. Used for short, single-line fields. */
export function cleanText(value: unknown): string {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Same idea, but preserves newlines/paragraph structure for longer markdown blobs. */
export function cleanLongText(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, maxLength)
    .trim();
}

export function stripMarkdown(markdown: string): string {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#>*_~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerpt(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
