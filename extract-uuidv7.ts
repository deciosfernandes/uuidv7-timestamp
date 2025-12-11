/**
 * Utilities for extracting the timestamp from a UUID v7 in TypeScript.
 *
 * The original Java method used:
 *   long millis = (uuid.getMostSignificantBits() >>> 16);
 * which takes the top 48 bits (time_low + time_mid) of the UUID MSB and treats that as
 * a millisecond unix timestamp (UUID v7 layout).
 *
 * This module provides equivalent behavior for use in an Angular/TypeScript app.
 */

const HEX_32_RE = /^[0-9a-f]{32}$/i;

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

  // Normalize: remove hyphens and lowercase
  const normalized = uuid.replace(/-/g, '').toLowerCase();

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
  // Use BigInt to avoid precision issues for larger values, then convert to Number.
  const millisBig = BigInt(`0x${timeHex}`);
  const millis = Number(millisBig);

  // 48-bit value fits safely into JS Number (53-bit mantissa), but still validate
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

/*
 Example usage:
   import { extractTimestampFromUuidV7, extractTimestampAsDate } from './extract-uuidv7';

   const uuid = '017f7f58-89ab-7000-8123-0123456789ab'; // example v7
   const millis = extractTimestampFromUuidV7(uuid);
   const date = extractTimestampAsDate(uuid);
*/