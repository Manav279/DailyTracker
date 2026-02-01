import { db } from '../db/db';
import { liveQuery } from 'dexie';

export const journalService = {
    // Get entry for a specific date
    getEntry(date: string) {
        return liveQuery(() => db.journal.where('date').equals(date).first());
    },

    // Save or update an entry
    async saveEntry(date: string, content: string) {
        const existing = await db.journal.where('date').equals(date).first();

        if (existing && existing.id) {
            return await db.journal.update(existing.id, { content });
        } else {
            return await db.journal.add({ date, content });
        }
    },

    // Get recent entries (limit for history view)
    getRecentEntries(limit: number = 30) {
        return liveQuery(() =>
            db.journal
                .orderBy('date')
                .reverse()
                .limit(limit)
                .toArray()
        );
    }
};
