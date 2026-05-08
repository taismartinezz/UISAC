// Server-side only — never import this in client components.
// ADMIN_EMAILS is a comma-separated list set in .env.local
const raw = process.env.ADMIN_EMAILS ?? "";

export const adminEmails: Set<string> = new Set(
  raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdminEmail(email: string): boolean {
  return adminEmails.has(email.toLowerCase());
}
