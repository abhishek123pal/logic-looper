import { dbPromise } from './db';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

export async function savePuzzle(date, data) {
  const db = await dbPromise;
  const compressed = compressToUTF16(JSON.stringify(data));
  await db.put('puzzles', { date, data: compressed });
}

export async function loadPuzzle(date) {
  const db = await dbPromise;
  const record = await db.get('puzzles', date);
  if (!record) return null;
  return JSON.parse(decompressFromUTF16(record.data));
}
