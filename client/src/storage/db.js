import { openDB } from 'idb';

// Version ko 1 se 2 kar diya taaki naya store create ho sake
export const dbPromise = openDB('logicLooperDB', 2, {
  upgrade(db, oldVersion, newVersion) {
    // Purane stores ko check karna (v1 logic)
    if (!db.objectStoreNames.contains('puzzles')) {
      db.createObjectStore('puzzles', { keyPath: 'date' });
    }

    if (!db.objectStoreNames.contains('stats')) {
      db.createObjectStore('stats', { keyPath: 'id' });
    }

    // 🔥 Heatmap ke liye naya store (v2 logic)
    // KeyPath 'date' hoga (e.g., '2026-02-19')
    if (!db.objectStoreNames.contains('dailyActivity')) {
      db.createObjectStore('dailyActivity', { keyPath: 'date' });
    }
  },
});