<script setup lang="ts">
import AppCard from '../ui/AppCard.vue';

interface Props {
  streak: number;
}

defineProps<Props>();
</script>

<template>
  <AppCard class="relative overflow-hidden">
    <div class="flex items-center gap-4 relative z-10">
      <div class="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=""><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
      </div>
      <div>
        <div class="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
          {{ streak }} <span class="text-sm font-normal text-foreground-muted">days</span>
        </div>
        <div class="text-xs text-foreground-subtle uppercase tracking-wider font-medium">Current Streak</div>
      </div>
    </div>
    
    <!-- Ambient Glow -->
    <div class="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-[50px] pointer-events-none"></div>
  </AppCard>
</template>
