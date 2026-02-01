<script setup lang="ts">
import type { TaskPillar } from '../../db/db';

interface HabitHistory {
  id: number;
  title: string;
  pillar: TaskPillar;
  history: boolean[]; // 7 booleans for the last 7 days
}

interface Props {
  data: {
      dates: string[];
      habits: HabitHistory[];
  };
}

defineProps<Props>();

const getDayLabel = (dateStr: string) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[new Date(dateStr).getDay()];
};

const getPillarColor = (pillar: TaskPillar) => {
    switch (pillar) {
        case 'Physical': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
        case 'Mental': return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]';
        case 'Social': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    }
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left py-2 font-normal text-xs text-foreground-muted uppercase tracking-wider pl-2">Habit</th>
          <th v-for="date in data.dates" :key="date" class="pb-2 text-center w-8">
             <span class="text-[10px] text-foreground-muted font-mono uppercase">{{ getDayLabel(date) }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="habit in data.habits" :key="habit.id" class="border-t border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
          <td class="py-3 pl-2 pr-4">
             <div class="flex flex-col">
                 <span class="text-xs font-medium text-white truncate max-w-[120px]">{{ habit.title }}</span>
                 <span class="text-[10px] text-foreground-subtle">{{ habit.pillar }}</span>
             </div>
          </td>
          <td v-for="(done, index) in habit.history" :key="index" class="text-center p-1">
             <div class="w-full h-8 rounded-md flex items-center justify-center transition-all duration-300"
                  :class="done ? 'bg-white/[0.08]' : ''">
                 <div v-if="done" 
                      class="w-4 h-4 rounded-full transition-all duration-500 ease-out transform scale-100"
                      :class="getPillarColor(habit.pillar)"
                 ></div>
                 <div v-else class="w-1 h-1 rounded-full bg-white/10"></div>
             </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="data.habits.length === 0" class="text-center py-6 text-foreground-muted text-sm">
      No habits to display.
    </div>
  </div>
</template>
