import { db, type TaskPillar } from '../db/db';
import { liveQuery } from 'dexie';

export const taskService = {
    // Add a new task
    async addTask(title: string, pillar: TaskPillar, frequency: string = 'daily'): Promise<number> {
        return await db.tasks.add({
            title,
            pillar,
            frequency
        });
    },

    // Get all tasks (observable)
    getTasksLine() {
        return liveQuery(() => db.tasks.toArray());
    },

    // Get tasks with their status for a specific date
    getTasksForDate(dateStr: string) {
        return liveQuery(async () => {
            const tasks = await db.tasks.toArray();
            const logs = await db.taskLogs.where('date').equals(dateStr).toArray();

            return tasks.map(task => {
                const log = logs.find(l => l.taskId === task.id);
                return {
                    ...task,
                    status: log ? log.status : 'pending',
                    logId: log ? log.id : undefined,
                    loggedLate: log ? log.loggedLate : false
                };
            });
        });
    },

    // Toggle task status
    async toggleTaskStatus(taskId: number, dateStr: string, currentStatus: 'pending' | 'completed' | 'skipped', isYesterday: boolean = false) {
        // Find existing log
        const existingLog = await db.taskLogs
            .where({ taskId, date: dateStr })
            .first();

        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'; // Simple toggle for now

        if (existingLog) {
            if (newStatus === 'pending') {
                if (existingLog.id) await db.taskLogs.delete(existingLog.id);
            } else {
                if (existingLog.id) await db.taskLogs.update(existingLog.id, { status: newStatus });
            }
        } else {
            if (newStatus !== 'pending') {
                await db.taskLogs.add({
                    taskId,
                    date: dateStr,
                    status: newStatus,
                    loggedLate: isYesterday
                });
            }
        }
    },

    // Get generic stats for a date
    async getDailyStats(dateStr: string) {
        const allTasksCount = await db.tasks.count();
        const completedCount = await db.taskLogs
            .where('date').equals(dateStr)
            .and(log => log.status === 'completed')
            .count();

        return {
            total: allTasksCount,
            completed: completedCount,
            pending: allTasksCount - completedCount
        };
    },

    // Analytics: Get Stats for a Period (e.g. 7 or 30 days)
    async getPeriodStats(daysCount: number): Promise<{ date: string; count: number; physical: number; mental: number; social: number }[]> {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (daysCount - 1)); // Include today

        const days: string[] = [];
        const current = new Date(start);

        // Generate dates
        for (let i = 0; i < daysCount; i++) {
            days.push(current.toISOString().substring(0, 10));
            current.setDate(current.getDate() + 1);
        }

        // Get pillar mapping
        const tasks = await db.tasks.toArray();
        const taskMap = new Map<number, TaskPillar>();
        tasks.forEach(t => { if (t.id) taskMap.set(t.id, t.pillar) });

        const stats = await Promise.all(days.map(async (date) => {
            const logs = await db.taskLogs
                .where('date').equals(date)
                .and(log => log.status === 'completed')
                .toArray();

            let physical = 0, mental = 0, social = 0;

            logs.forEach(log => {
                const pillar = taskMap.get(log.taskId);
                if (pillar === 'Physical') physical++;
                else if (pillar === 'Mental') mental++;
                else if (pillar === 'Social') social++;
            });

            return { date, count: logs.length, physical, mental, social };
        }));

        return stats;
    },

    // Backwards compatibility for now (or useful shortcut)
    async getWeeklyStats() {
        return this.getPeriodStats(7);
    },

    // Analytics: Get Pillar Distribution with Date Range
    async getPillarStats(daysCount: number = 0) { // 0 for all-time
        let completedLogs;

        if (daysCount > 0) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - (daysCount - 1));
            const startStr = start.toISOString().substring(0, 10);
            const endStr = end.toISOString().substring(0, 10);

            completedLogs = await db.taskLogs
                .where('date').between(startStr, endStr, true, true)
                .and(log => log.status === 'completed')
                .toArray();
        } else {
            completedLogs = await db.taskLogs.where('status').equals('completed').toArray();
        }

        const tasks = await db.tasks.toArray();

        // Explicitly handle optional IDs by filtering
        const taskMap = new Map<number, TaskPillar>();
        tasks.forEach(t => {
            if (t.id !== undefined) {
                taskMap.set(t.id, t.pillar);
            }
        });

        const distribution: Record<TaskPillar, number> = { Physical: 0, Mental: 0, Social: 0 };

        completedLogs.forEach(log => {
            const pillar = taskMap.get(log.taskId);
            if (pillar && distribution[pillar] !== undefined) {
                distribution[pillar]++;
            }
        });

        return distribution;
    },

    // Analytics: Current Streak
    async getCurrentStreak() {
        let streak = 0;
        const today = new Date();
        let d = new Date(today);

        let safety = 0;
        while (safety < 365) {
            const dateStr = d.toISOString().substring(0, 10);
            const count = await db.taskLogs
                .where('date').equals(dateStr)
                .and(log => log.status === 'completed')
                .count();

            if (count > 0) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                const isToday = dateStr === new Date().toISOString().substring(0, 10);
                if (isToday) {
                    d.setDate(d.getDate() - 1);
                    safety++;
                    continue;
                }
                break;
            }
            safety++;
        }
        return streak;
    },

    // Analytics: Per-Habit Streaks
    async getHabitStreaks(): Promise<{ id: number; title: string; pillar: TaskPillar; streak: number }[]> {
        const tasks = await db.tasks.toArray();
        const result = [];
        const today = new Date();
        const todayStr = today.toISOString().substring(0, 10);

        for (const task of tasks) {
            if (!task.id) continue;

            const logs = await db.taskLogs.where('taskId').equals(task.id).toArray();

            let streak = 0;
            let currentCheckDate = new Date(today);
            let safety = 0;

            while (safety < 365) {
                const checkStr = currentCheckDate.toISOString().substring(0, 10);
                const hasLog = logs.find(l => l.date === checkStr && l.status === 'completed');

                if (hasLog) {
                    streak++;
                    currentCheckDate.setDate(currentCheckDate.getDate() - 1);
                } else {
                    if (checkStr === todayStr) {
                        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
                        safety++;
                        continue;
                    }
                    break;
                }
                safety++;
            }
            result.push({ id: task.id, title: task.title, pillar: task.pillar, streak });
        }

        return result.sort((a, b) => b.streak - a.streak);
    },

    // Analytics: Habit History Matrix (Last 7 Days)
    async getHabitHistory(): Promise<{ dates: string[], habits: { id: number; title: string; pillar: TaskPillar; history: boolean[] }[] }> {
        const tasks = await db.tasks.toArray();
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);

        const dates: string[] = [];
        const current = new Date(start);
        for (let i = 0; i < 7; i++) {
            dates.push(current.toISOString().substring(0, 10));
            current.setDate(current.getDate() + 1);
        }

        const historyData = await Promise.all(tasks.map(async (task) => {
            if (!task.id) return null;

            const logs = await db.taskLogs
                .where('taskId').equals(task.id)
                .and(l => l.status === 'completed')
                .toArray();

            const history = dates.map(date => {
                return logs.some(l => l.date === date);
            });

            return {
                id: task.id,
                title: task.title,
                pillar: task.pillar,
                history
            };
        }));

        // Filter nulls 
        const validHabits = historyData.filter(h => h !== null) as { id: number; title: string; pillar: TaskPillar; history: boolean[] }[];

        return {
            dates,
            habits: validHabits
        };
    }
};
