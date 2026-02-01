<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { taskService } from '../services/taskService';
import type { TaskPillar } from '../db/db';
import AppCard from '../components/ui/AppCard.vue';
import ActivityBarChart from '../components/analytics/ActivityBarChart.vue';
import StreakCard from '../components/analytics/StreakCard.vue';
import HabitStreakList from '../components/analytics/HabitStreakList.vue';
import HabitHistoryGrid from '../components/analytics/HabitHistoryGrid.vue';

// Define types locally for now if not exported
interface DailyStat {
  date: string;
  count: number;
  physical: number;
  mental: number;
  social: number;
}

interface HabitStreak {
  id: number;
  title: string;
  pillar: TaskPillar;
  streak: number;
}

const period = ref<'weekly' | 'monthly'>('weekly');
const periodStats = ref<DailyStat[]>([]);
const pillarData = ref<{Physical: number, Mental: number, Social: number}>({ Physical: 0, Mental: 0, Social: 0 });
const currentStreak = ref(0);
const habitStreaks = ref<HabitStreak[]>([]);
const historyData = ref<{dates: string[], habits: any[]}>({ dates: [], habits: [] });
const loading = ref(true);

const fetchPeriodData = async () => {
    const days = period.value === 'weekly' ? 7 : 30;
    const [stats, pillars] = await Promise.all([
        taskService.getPeriodStats(days),
        taskService.getPillarStats(days)
    ]);
    periodStats.value = stats;
    pillarData.value = pillars as any;
};

// Initial load
onMounted(async () => {
  try {
    const [streak, habits, history] = await Promise.all([
      taskService.getCurrentStreak(),
      taskService.getHabitStreaks(),
      taskService.getHabitHistory()
    ]);
    
    currentStreak.value = streak;
    habitStreaks.value = habits;
    historyData.value = history;

    await fetchPeriodData();
  } finally {
    loading.value = false;
  }
});

// Watch period change
watch(period, async () => {
    await fetchPeriodData();
});
</script>

<template>
  <div class="px-6 pt-12 pb-24">
    <header class="mb-8 animate-slide-up-fade">
      <h1 class="text-4xl font-semibold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
        Insights
      </h1>
    </header>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-32 bg-white/5 rounded-2xl"></div>
      <div class="h-48 bg-white/5 rounded-2xl"></div>
    </div>

    <div v-else class="space-y-6 animate-slide-up-fade [animation-delay:100ms] opacity-0 fill-mode-forwards">
      
      <!-- 1. Daily Streak -->
      <StreakCard :streak="currentStreak" />

      <!-- 2. Tasks Streaks -->
      <HabitStreakList :habits="habitStreaks" />

      <!-- 3. History (Always 7 Days) -->
      <AppCard>
        <h3 class="font-semibold text-lg mb-4">Recent History</h3>
        <HabitHistoryGrid :data="historyData" />
      </AppCard>

      <!-- Period Toggle Row -->
      <div class="flex items-center justify-between mt-8 mb-2">
         <h3 class="font-semibold text-lg">Activity</h3>
         <div class="flex bg-white/[0.05] rounded-lg p-1 border border-white/10">
            <button 
              @click="period = 'weekly'"
              class="px-3 py-1 text-[10px] font-medium rounded-md transition-all"
              :class="period === 'weekly' ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground'"
            >
              Weekly
            </button>
            <button 
              @click="period = 'monthly'"
              class="px-3 py-1 text-[10px] font-medium rounded-md transition-all"
              :class="period === 'monthly' ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground'"
            >
              Monthly
            </button>
          </div>
      </div>

      <!-- 4. Activity Chart -->
      <AppCard class="p-0 overflow-hidden relative" variant="glass">
         <div class="p-4 pb-0">
             <div class="text-xs text-foreground-muted mb-4 uppercase tracking-wider">
                 {{ period === 'weekly' ? 'Last 7 Days' : 'Last 30 Days' }}
             </div>
         </div>
         <ActivityBarChart :data="periodStats" />
      </AppCard>

      <!-- 5. Pillar Breakdown (Life Balance) -->
      <AppCard>
        <h3 class="font-semibold text-lg mb-6">Life Balance</h3>
        <div class="flex justify-between text-xs text-foreground-muted mb-4">
             <span>Distribution for {{ period === 'weekly' ? 'Last 7 Days' : 'Last 30 Days' }}</span>
        </div>
        <div class="space-y-4">
          <!-- Physical -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-emerald-400 font-medium">Physical</span>
              <span class="text-foreground-muted">{{ pillarData.Physical }} tasks</span>
            </div>
            <div class="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
               <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${(pillarData.Physical / (pillarData.Physical + pillarData.Mental + pillarData.Social || 1)) * 100}%` }"></div>
            </div>
          </div>

          <!-- Mental -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-indigo-400 font-medium">Mental</span>
              <span class="text-foreground-muted">{{ pillarData.Mental }} tasks</span>
            </div>
            <div class="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
               <div class="h-full bg-indigo-500 rounded-full" :style="{ width: `${(pillarData.Mental / (pillarData.Physical + pillarData.Mental + pillarData.Social || 1)) * 100}%` }"></div>
            </div>
          </div>

          <!-- Social -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-amber-400 font-medium">Social</span>
              <span class="text-foreground-muted">{{ pillarData.Social }} tasks</span>
            </div>
            <div class="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
               <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${(pillarData.Social / (pillarData.Physical + pillarData.Mental + pillarData.Social || 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </AppCard>

    </div>
  </div>
</template>

<style scoped>
.animate-slide-up-fade {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fill-mode-forwards {
  animation-fill-mode: forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
