import { db } from '../db/db';

export const dataService = {
    // Export all data to a JSON file
    async exportData() {
        try {
            const tasks = await db.tasks.toArray();
            const taskLogs = await db.taskLogs.toArray();
            const journal = await db.journal.toArray();

            const data = {
                version: 1,
                timestamp: new Date().toISOString(),
                tasks,
                taskLogs,
                journal
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-tracker-backup-${new Date().toISOString().substring(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    },

    // Import data from a JSON file
    async importData(file: File): Promise<{ success: boolean; message: string }> {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const json = e.target?.result as string;
                    const data = JSON.parse(json);

                    // Basic validation
                    if (!data.tasks || !data.taskLogs || !data.journal) {
                        resolve({ success: false, message: 'Invalid backup file format.' });
                        return;
                    }

                    await db.transaction('rw', db.tasks, db.taskLogs, db.journal, async () => {
                        // We use bulkPut to overwrite existing items with same ID, or add new ones
                        if (data.tasks.length) await db.tasks.bulkPut(data.tasks);
                        if (data.taskLogs.length) await db.taskLogs.bulkPut(data.taskLogs);
                        if (data.journal.length) await db.journal.bulkPut(data.journal);
                    });

                    resolve({ success: true, message: 'Data imported successfully.' });
                } catch (error) {
                    console.error('Import failed:', error);
                    resolve({ success: false, message: 'Failed to parse or save data.' });
                }
            };

            reader.onerror = () => {
                resolve({ success: false, message: 'Failed to read file.' });
            };

            reader.readAsText(file);
        });
    },

    // Clear all data
    async clearAllData() {
        await db.transaction('rw', db.tasks, db.taskLogs, db.journal, async () => {
            await db.tasks.clear();
            await db.taskLogs.clear();
            await db.journal.clear();
        });
    },

    // Request Persistent Storage
    async requestPersistentStorage() {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persist();
            console.log(`Persisted storage granted: ${isPersisted}`);
            return isPersisted;
        }
        return false;
    }
};
