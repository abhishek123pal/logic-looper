import { openDB } from 'idb';

const dbPromise = openDB('LogicLooper_Offline', 1, {
  upgrade(db) {
    db.createObjectStore('api-cache');
  },
});

export const offlineManager = {
  // Data save karna (Stats/Leaderboard)
  async save(key, data) {
    const db = await dbPromise;
    await db.put('api-cache', data, key);
  },

  // Data nikalna
  async get(key) {
    const db = await dbPromise;
    return await db.get('api-cache', key);
  }
};