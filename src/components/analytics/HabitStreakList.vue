<script setup lang="ts">
import { computed } from 'vue';
import type { TaskPillar } from '../../db/db';
import AppCard from '../ui/AppCard.vue';

interface HabitStreak {
  id: number;
  title: string;
  pillar: TaskPillar;
  streak: number;
}

interface Props {
  habits: HabitStreak[];
}

const props = defineProps<Props>();

const sortedHabits = computed(() => {
  return [...props.habits].sort((a, b) => b.streak - a.streak);
});

const getPillarColor = (pillar: TaskPillar) => {
  switch (pillar) {
    case 'Physical': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Mental': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
    case 'Social': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  }
};
</script>

<template>
  <AppCard>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">Habit Streaks</h3>
      <span class="text-xs text-foreground-subtle">Top Performers</span>
    </div>
    
    <div v-if="habits.length === 0" class="text-center py-6 text-foreground-muted text-sm">
      No habits tracked yet.
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="habit in sortedHabits" 
        :key="habit.id"
        class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
      >
        <div class="flex items-center gap-3">
          <!-- Pillar Icon -->
          <div :class="`w-8 h-8 rounded-lg flex items-center justify-center border ${getPillarColor(habit.pillar)}`">
             <!-- Simple abstract shapes for pillars -->
             <div class="w-2 h-2 rounded-full bg-current"></div>
          </div>
          
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ habit.title }}</span>
            <span class="text-[10px] text-foreground-muted uppercase tracking-wider">{{ habit.pillar }}</span>
          </div>
        </div>

        <!-- Streak Counter -->
        <div class="flex items-center gap-1.5" :class="habit.streak > 0 ? 'text-orange-400' : 'text-foreground-muted'">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="opacity-80"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
          <span class="font-mono font-bold">{{ habit.streak }}</span>
        </div>
      </div>
    </div>
  </AppCard>
</template>
