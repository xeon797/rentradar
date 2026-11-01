import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Masks raw meter or holding tax credential strings preserving first 4 and last 3 characters.
 */
export function maskCredentialString(val: string, prefix = "DOC"): string {
  const trimmed = (val || "").trim().toUpperCase();
  if (trimmed.length <= 6) return `${prefix}-****-${trimmed || "001"}`;
  const start = trimmed.slice(0, 4);
  const end = trimmed.slice(-3);
  return `${start}-****-${end}`;
}

/**
 * Deterministic token similarity algorithm comparing listing address against utility service address.
 */
export function calculateAddressTokenSimilarity(addrA: string, addrB: string): number {
  if (!addrA || !addrB) return 50;
  const cleanTokens = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const tokensA = new Set(cleanTokens(addrA));
  const tokensB = new Set(cleanTokens(addrB));

  if (tokensA.size === 0 || tokensB.size === 0) return 50;

  let common = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) common++;
  }

  const similarity = (common / Math.max(tokensA.size, tokensB.size)) * 100;
  return Math.min(100, Math.max(25, Math.round(similarity)));
}
