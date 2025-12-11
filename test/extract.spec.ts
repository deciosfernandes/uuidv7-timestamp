import { describe, it, expect } from 'vitest';
import { extractTimestampFromUuidV7, extractTimestampAsDate } from '../src/index';

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
});