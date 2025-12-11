import { describe, it, expect } from 'vitest';
import { extractTimestampFromUuidV7, extractTimestampAsDate, extractTimestampAsISOString } from '../src/index';

describe('UUID v7 timestamp extractor', () => {
  it('extracts milliseconds and date from a v7 uuid', () => {
    // timestamp part (first 12 hex) = 0x017f7f589abc => arbitrary 48-bit hex value
    const timeHex = '017f7f589abc';
    // build a v7 like UUID: time_low-time_mid-time_hi_and_version-clockseq-node
    // ensure version nibble is '7' in the third block
    const uuid = `${timeHex.slice(0,8)}-${timeHex.slice(8,12)}-7abc-8123-0123456789ab`;
    const ms = extractTimestampFromUuidV7(uuid);
    const date = extractTimestampAsDate(uuid);
    expect(ms).toBe(Number(BigInt(`0x${timeHex}`)));
    expect(date.getTime()).toBe(ms);
  });

  it('works with UUID without hyphens', () => {
    const timeHex = '017f7f589abc';
    const uuid = `${timeHex}7abc81230123456789ab`;
    const ms = extractTimestampFromUuidV7(uuid);
    expect(ms).toBe(Number(BigInt(`0x${timeHex}`)));
  });

  it('extracts ISO string correctly', () => {
    const timeHex = '017f7f589abc';
    const uuid = `${timeHex.slice(0,8)}-${timeHex.slice(8,12)}-7abc-8123-0123456789ab`;
    const isoString = extractTimestampAsISOString(uuid);
    const expectedDate = new Date(Number(BigInt(`0x${timeHex}`)));
    expect(isoString).toBe(expectedDate.toISOString());
  });

  it('throws error for non-UUID v7 (wrong version)', () => {
    const uuid = '017f7f58-9abc-6abc-8123-0123456789ab'; // version 6, not 7
    expect(() => extractTimestampFromUuidV7(uuid)).toThrow('expected UUID v7');
  });

  it('throws error for invalid UUID format', () => {
    expect(() => extractTimestampFromUuidV7('not-a-uuid')).toThrow('invalid UUID format');
  });

  it('throws error for empty string', () => {
    expect(() => extractTimestampFromUuidV7('')).toThrow('uuid must be a non-empty string');
  });

  it('throws error for non-string input', () => {
    expect(() => extractTimestampFromUuidV7(null as any)).toThrow('uuid must be a non-empty string');
  });

  it('handles mixed case UUIDs', () => {
    const timeHex = '017f7f589abc';
    const uuid = `${timeHex.slice(0,8).toUpperCase()}-${timeHex.slice(8,12).toLowerCase()}-7ABC-8123-0123456789AB`;
    const ms = extractTimestampFromUuidV7(uuid);
    expect(ms).toBe(Number(BigInt(`0x${timeHex}`)));
  });

  it('handles zero timestamp', () => {
    const uuid = '00000000-0000-7000-8000-000000000000';
    const ms = extractTimestampFromUuidV7(uuid);
    expect(ms).toBe(0);
    expect(extractTimestampAsDate(uuid).toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });
});