<script setup lang="ts">
import { computed } from 'vue';
import type { TaskPillar } from '../db/db';

interface Props {
  id: number;
  title: string;
  pillar: TaskPillar;
  status: 'pending' | 'completed' | 'skipped';
  loggedLate?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['toggle']);

const isCompleted = computed(() => props.status === 'completed');

const pillarColors = {
  Physical: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Mental: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  Social: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
};

const pillarColorClass = computed(() => pillarColors[props.pillar]);
</script>

<template>
  <div 
    class="group flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
    @click="emit('toggle')"
  >
    <div class="flex items-center gap-4">
      <!-- Custom Checkbox -->
      <div 
        class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 relative overflow-hidden"
        :class="isCompleted ? 'bg-accent border-accent text-white scale-100' : 'border-white/20 group-hover:border-white/40 scale-95'"
      >
         <!-- Check icon -->
         <svg v-if="isCompleted" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="animate-in zoom-in duration-200"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>

      <!-- Task Details -->
      <div>
        <h3 class="font-medium text-sm transition-colors duration-200" :class="isCompleted ? 'text-foreground-muted line-through' : 'text-foreground'">{{ title }}</h3>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] px-1.5 py-0.5 rounded-md border font-mono tracking-wider uppercase" :class="pillarColorClass">{{ pillar }}</span>
          <span v-if="loggedLate" class="text-[10px] text-orange-400/80">Logged Late</span>
        </div>
      </div>
    </div>
  </div>
</template>
