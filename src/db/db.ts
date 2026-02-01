import Dexie, { type Table } from 'dexie';

export type TaskPillar = 'Physical' | 'Mental' | 'Social';

export interface Task {
    id?: number;
    title: string;
    pillar: TaskPillar;
    frequency: string;
}

export interface TaskLog {
    id?: number;
    taskId: number;
    date: string; // YYYY-MM-DD
    status: 'completed' | 'skipped';
    loggedLate: boolean;
}

export interface JournalEntry {
    id?: number;
    date: string;
    content: string;
}

export class DailyTrackerDB extends Dexie {
    tasks!: Table<Task>;
    taskLogs!: Table<TaskLog>;
    journal!: Table<JournalEntry>;

    constructor() {
        super('DailyTrackerDB');
        this.version(1).stores({
            tasks: '++id, title, pillar, frequency',
            taskLogs: '++id, taskId, date, status, loggedLate',
            journal: '++id, date'
        });
    }
}

export const db = new DailyTrackerDB();
