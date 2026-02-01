<script setup lang="ts">
import { ref, computed, watchEffect, onUnmounted } from 'vue';
import { taskService } from '../services/taskService';
import type { TaskPillar } from '../db/db';
import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AddTaskModal from '../components/AddTaskModal.vue';
import TaskItem from '../components/TaskItem.vue';
import QuoteCard from '../components/QuoteCard.vue';
import type { Observable, Subscription } from 'rxjs';

// Date Logic
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

// State
const viewDate = ref(todayStr); // 'YYYY-MM-DD'
const showAddModal = ref(false);
const tasks = ref<any[]>([]); 
const stats = ref<{total: number, completed: number, pending: number}>({ total: 0, completed: 0, pending: 0 });

const isYesterday = computed(() => viewDate.value === yesterdayStr);
const displayDate = computed(() => {
  const d = new Date(viewDate.value as string);
  // Fix timezone offset for display since we are using simplified date strings
  const userTimezoneOffset = d.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(d.getTime() + userTimezoneOffset);
  
  return adjustedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
});

let tasksSubscription: Subscription | null = null;

// Live Query for Tasks
watchEffect(() => {
  if (tasksSubscription) tasksSubscription.unsubscribe();

  // Tasks Observable based on selected viewDate
  const tasks$ = taskService.getTasksForDate(viewDate.value as string) as unknown as Observable<any[]>;
  tasksSubscription = tasks$.subscribe((realTimeTasks: any[]) => {
    tasks.value = realTimeTasks;
    
    // Update local stats
    const completed = realTimeTasks.filter((t: any) => t.status === 'completed').length;
    stats.value = {
      total: realTimeTasks.length,
      completed,
      pending: realTimeTasks.length - completed
    };
  });
});

onUnmounted(() => {
  if (tasksSubscription) tasksSubscription.unsubscribe();
});

// Actions
const handleSaveTask = async (taskData: { title: string, pillar: TaskPillar, frequency: string }) => {
  // Always add tasks for "Today" regardless of view, or maybe allow adding for yesterday?
  // Use case: User forgot to add a task yesterday. 
  // Decision: New tasks are always created for the *current* view date context effectively by nature of frequency,
  // but conceptually habits are persistent. 
  // Let's keep habit creation generic (it shows up on both days if daily).
  await taskService.addTask(taskData.title, taskData.pillar, taskData.frequency || 'daily');
  showAddModal.value = false;
};

const handleToggleTask = async (task: any) => {
  if (!task.status) return;
  // Pass isYesterday flag if we are viewing yesterday
  await taskService.toggleTaskStatus(task.id, viewDate.value as string, task.status, isYesterday.value);
};

const switchView = (target: 'today' | 'yesterday') => {
  viewDate.value = target === 'today' ? todayStr : yesterdayStr;
};
</script>

<template>
  <div class="px-6 pt-12 pb-24">
    <!-- Header with Toggle -->
    <header class="mb-8 animate-slide-up-fade">
      <div class="flex items-center justify-between mb-4">
        <div class="inline-block px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 transition-colors" :class="isYesterday ? 'border-orange-400/30 bg-orange-400/5' : ''">
          <span class="text-xs font-mono tracking-widest text-foreground-subtle uppercase" :class="isYesterday ? 'text-orange-200' : ''">{{ displayDate }}</span>
        </div>
        
        <!-- Date Switcher -->
        <div class="flex bg-white/[0.05] rounded-lg p-1 border border-white/10">
          <button 
            @click="switchView('yesterday')"
            class="px-3 py-1 text-[10px] font-medium rounded-md transition-all"
            :class="isYesterday ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground'"
          >
            Yesterday
          </button>
          <button 
            @click="switchView('today')"
            class="px-3 py-1 text-[10px] font-medium rounded-md transition-all"
            :class="!isYesterday ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground'"
          >
            Today
          </button>
        </div>
      </div>

      <h1 class="text-4xl font-semibold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent transition-all duration-300">
        <span v-if="isYesterday" class="text-orange-100/90 [text-shadow:_0_0_30px_rgba(251,146,60,0.3)]">Yesterday's<br>Review</span>
        <span v-else>Today's<br>Focus</span>
      </h1>
    </header>

    <!-- Quote of the Day -->
    <div class="animate-slide-up-fade [animation-delay:50ms] opacity-0 fill-mode-forwards">
      <QuoteCard />
    </div>

    <!-- Stats Row (Bento) -->
    <div class="grid grid-cols-2 gap-4 mb-8 animate-slide-up-fade [animation-delay:100ms] opacity-0 fill-mode-forwards">
      <AppCard class="flex flex-col justify-between" variant="glass">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div>
          <div class="text-2xl font-semibold">{{ stats.completed }}</div>
          <div class="text-xs text-foreground-subtle">Completed</div>
        </div>
      </AppCard>

      <AppCard class="flex flex-col justify-between" variant="glass">
        <div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div>
          <div class="text-2xl font-semibold">{{ stats.pending }}</div>
          <div class="text-xs text-foreground-subtle">Pending</div>
        </div>
      </AppCard>
    </div>

    <!-- Empty State (Only show if no tasks) -->
    <div v-if="tasks.length === 0" class="mb-8 animate-slide-up-fade [animation-delay:200ms] opacity-0 fill-mode-forwards">
      <AppCard class="p-0 overflow-hidden relative" :spotlight="true">
        <div class="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50 z-0"></div>
        <div class="relative z-10 p-6">
          <h2 class="text-xl font-semibold mb-2 text-white">Start your day</h2>
          <p class="text-foreground-muted mb-6 text-sm">You have 0 tasks scheduled for today.</p>
          <AppButton full-width @click="showAddModal = true">
            <span class="mr-2">+</span> New Task
          </AppButton>
        </div>
      </AppCard>
    </div>

    <!-- Task List -->
    <div v-else class="space-y-3 mb-24 animate-slide-up-fade [animation-delay:200ms] opacity-0 fill-mode-forwards">
      <div class="flex justify-between items-end mb-2">
         <h3 class="text-lg font-semibold">Your Habits</h3>
         <button @click="showAddModal = true" class="text-xs text-accent hover:text-accent-bright font-medium">+ Add New</button>
      </div>

      <TaskItem 
        v-for="task in tasks" 
        :key="task.id"
        :id="task.id"
        :title="task.title"
        :pillar="task.pillar"
        :status="task.status"
        :logged-late="task.loggedLate"
        @toggle="handleToggleTask(task)"
      />
    </div>

    <!-- Add Task Modal -->
    <AddTaskModal 
      :is-open="showAddModal" 
      @close="showAddModal = false"
      @save="handleSaveTask"
    />

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
