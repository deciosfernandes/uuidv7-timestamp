/**
 * Extract timestamp from UUID v7 strings.
 *
 * The timestamp for UUID v7 is encoded in the first 48 bits (12 hex chars) of the UUID.
 * This module exposes three helpers:
 * - extractTimestampFromUuidV7(uuid): number (epoch millis)
 * - extractTimestampAsDate(uuid): Date
 * - extractTimestampAsISOString(uuid): string
 */

const HEX_32_RE = /^[0-9a-fA-F]{32}$/;

/**
 * Extracts the epoch milliseconds timestamp from a UUID v7 string.
 * Caller must pass a UUID v7 (validation is performed and an error thrown if it's not v7).
 *
 * @param uuid - UUID string (hyphenated or not)
 * @returns epoch milliseconds (number)
 * @throws Error if input is not a valid UUID string or not version 7
 */
export function extractTimestampFromUuidV7(uuid: string): number {
  if (typeof uuid !== 'string' || uuid.length === 0) {
    throw new Error('uuid must be a non-empty string');
  }

  // Normalize: remove hyphens
  const normalized = uuid.replace(/-/g, '');

  if (!HEX_32_RE.test(normalized)) {
    throw new Error('invalid UUID format');
  }

  // Version nibble is the first hex char of the 3rd UUID segment.
  // In the normalized string it's at index 12 (0-based).
  const versionChar = normalized[12];
  if (versionChar !== '7') {
    throw new Error(`expected UUID v7 (version nibble = 7), got version nibble = ${versionChar}`);
  }

  // Timestamp for UUID v7 is the top 48 bits: time_low (8 hex) + time_mid (4 hex) => first 12 hex chars
  const timeHex = normalized.slice(0, 12); // 12 hex chars => 48 bits
  const millisBig = BigInt(`0x${timeHex}`);
  const millis = Number(millisBig);

  if (!Number.isFinite(millis)) {
    throw new Error('extracted timestamp is not a finite number');
  }

  return millis;
}

/**
 * Same as extractTimestampFromUuidV7 but returns a Date instance.
 *
 * @param uuid - UUID v7 string
 * @returns Date representing the timestamp encoded in the UUID
 */
export function extractTimestampAsDate(uuid: string): Date {
  const ms = extractTimestampFromUuidV7(uuid);
  return new Date(ms);
}

/**
 * Convenience: returns an ISO string for the timestamp contained in the UUID v7.
 *
 * @param uuid - UUID v7 string
 * @returns ISO 8601 string (UTC)
 */
export function extractTimestampAsISOString(uuid: string): string {
  return extractTimestampAsDate(uuid).toISOString();
}

export default {
  extractTimestampFromUuidV7,
  extractTimestampAsDate,
  extractTimestampAsISOString
};