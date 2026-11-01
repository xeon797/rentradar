/**
 * RentRadar: 64-Bit Perceptual dHash & Hamming Distance Math Engine
 * Zero external dependencies. Mirrors PostgreSQL bit(64) <~> operator.
 * Works uniformly in Node.js server runtimes, Edge workers, and client browsers.
 */

/**
 * Normalizes either a 64-bit binary string ('0101...') or a 16-character hex string ('a4f0...')
 * into a clean, 64-character '0' | '1' binary string. Strips formatting hyphens/spaces.
 */
export function normalizeBinaryHash(hash: string): string {
  if (!hash) {
    return "0".repeat(64);
  }

  // Remove common separators (hyphens, spaces)
  const cleaned = hash.replace(/[\s\-_]/g, "");

  // If already 64 characters of binary (0s and 1s)
  if (/^[01]{64}$/.test(cleaned)) {
    return cleaned;
  }

  // If 16 hex characters (or 16-char hex with standard prefix)
  const hexMatch = cleaned.startsWith("0x") ? cleaned.slice(2) : cleaned;
  if (/^[0-9a-fA-F]{16}$/.test(hexMatch)) {
    let binaryResult = "";
    for (let i = 0; i < hexMatch.length; i++) {
      const nibble = parseInt(hexMatch[i], 16);
      binaryResult += nibble.toString(2).padStart(4, "0");
    }
    return binaryResult;
  }

  // Fallback / sanitize: pad or trim to 64 chars
  const binaryOnly = cleaned.replace(/[^01]/g, "");
  return binaryOnly.padEnd(64, "0").slice(0, 64);
}

/**
 * Converts a 64-bit binary string into a compact 16-character uppercase hex string
 * formatted in 4-character blocks (e.g. 'A9F4-81C2-00E3-7B19') for civic dockets.
 */
export function binaryToHexHash(bin64: string): string {
  const normalized = normalizeBinaryHash(bin64);
  let hexString = "";

  for (let i = 0; i < 64; i += 4) {
    const chunk = normalized.slice(i, i + 4);
    const hexChar = parseInt(chunk, 2).toString(16).toUpperCase();
    hexString += hexChar;
  }

  // Format as 4-char blocks: XXXX-XXXX-XXXX-XXXX
  return `${hexString.slice(0, 4)}-${hexString.slice(4, 8)}-${hexString.slice(8, 12)}-${hexString.slice(12, 16)}`;
}

/**
 * Counts the exact number of differing bit positions (Hamming distance, 0 to 64)
 * between two 64-bit perceptual hashes. Exactly mirrors PostgreSQL `(hashA <~> hashB)`.
 */
export function calculateHammingDistance(hashA: string, hashB: string): number {
  const normA = normalizeBinaryHash(hashA);
  const normB = normalizeBinaryHash(hashB);

  let distance = 0;
  for (let i = 0; i < 64; i++) {
    if (normA[i] !== normB[i]) {
      distance++;
    }
  }

  return distance;
}

/**
 * Calculates percentage visual similarity (0.0% to 100.0%) based on 64-bit Hamming distance.
 * 0 bits diff = 100.0%
 * 1 bit diff = 98.4%
 * 2 bits diff = 96.9%
 * 10 bits diff = 84.4%
 */
export function calculateHashSimilarityPercent(hashA: string, hashB: string): number {
  const distance = calculateHammingDistance(hashA, hashB);
  const similarity = ((64 - distance) / 64) * 100;
  return Math.max(0, Math.min(100, Math.round(similarity * 10) / 10));
}

/**
 * Converts a 64-bit binary hash into an 8x8 2D array of 0 and 1
 * for rendering visual gradient bit matrices on inspection dockets.
 */
export function hashTo8x8Matrix(hash: string): number[][] {
  const normalized = normalizeBinaryHash(hash);
  const matrix: number[][] = [];

  for (let row = 0; row < 8; row++) {
    const rowBits: number[] = [];
    for (let col = 0; col < 8; col++) {
      rowBits.push(normalized[row * 8 + col] === "1" ? 1 : 0);
    }
    matrix.push(rowBits);
  }

  return matrix;
}

/**
 * Generates a deterministic 64-bit binary hash from an arbitrary seed string.
 * Used for testing simulated uploads, fixtures, and unit tests without raw image buffers.
 * Implements 64-bit FNV-1a hashing.
 */
export function computeDeterministicTextSeedHash(seedString: string): string {
  let hash = BigInt("0xcbf29ce484222325");
  const prime = BigInt("0x100000001b3");
  const mask = BigInt("0xffffffffffffffff");

  for (let i = 0; i < seedString.length; i++) {
    hash ^= BigInt(seedString.charCodeAt(i));
    hash = (hash * prime) & mask;
  }

  return hash.toString(2).padStart(64, "0");
}
