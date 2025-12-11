# @deciosfernandes/uuidv7-timestamp

Extract epoch timestamp from UUID v7 strings (TypeScript).

This tiny library extracts the timestamp encoded in UUID v7 values (the first 48 bits / first 12 hex chars) and returns it as milliseconds, a Date, or an ISO string.

## Installation

npm:
```bash
npm install @deciosfernandes/uuidv7-timestamp
```

yarn:
```bash
yarn add @deciosfernandes/uuidv7-timestamp
```

## Usage

```ts
import { extractTimestampFromUuidV7, extractTimestampAsDate } from '@deciosfernandes/uuidv7-timestamp';

const uuid = '017f7f58-89ab-7000-8123-0123456789ab';
const millis = extractTimestampFromUuidV7(uuid);
const date = extractTimestampAsDate(uuid);
console.log(millis, date.toISOString());
```

## API

- extractTimestampFromUuidV7(uuid: string): number — returns epoch milliseconds encoded in the UUID v7.
- extractTimestampAsDate(uuid: string): Date — returns a Date instance.
- extractTimestampAsISOString(uuid: string): string — returns an ISO 8601 string.

## Notes

- The function validates the UUID format and ensures the version nibble is `7`. If the UUID is not v7, an Error is thrown.
- The timestamp is assumed to be the first 48 bits of the UUID per the v7 draft layout.

## License

MIT