<script setup lang="ts">
import { computed } from 'vue';

interface DailyStat {
  date: string;
  count: number;
  physical: number;
  mental: number;
  social: number;
}

interface Props {
  data: DailyStat[];
}

const props = defineProps<Props>();

const maxCount = computed(() => {
  const max = Math.max(...props.data.map(d => d.count));
  return max > 0 ? max : 5; // Default scale
});

const getDayLabel = (dateStr: string) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[new Date(dateStr).getDay()];
};

// Calculate height percentage relative to total max
const getRelativeHeight = (value: number) => {
  return `${(value / maxCount.value) * 100}%`;
};
</script>

<template>
  <div class="flex items-end justify-between h-32 px-2 pt-4 pb-2">
    <div 
      v-for="stat in data" 
      :key="stat.date" 
      class="flex flex-col items-center gap-2 group w-8"
    >
      <!-- Tooltip -->
      <div class="opacity-0 group-hover:opacity-100 absolute -mt-10 z-10 bg-background-elevated border border-white/10 px-2 py-1 rounded text-[10px] transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        <div class="font-semibold">{{ stat.count }} tasks</div>
        <div class="flex gap-2 text-foreground-muted">
           <span class="text-emerald-400">P:{{ stat.physical }}</span>
           <span class="text-indigo-400">M:{{ stat.mental }}</span>
           <span class="text-amber-400">S:{{ stat.social }}</span>
        </div>
      </div>

      <!-- Bar Track -->
      <div class="relative w-2 h-20 bg-white/[0.03] rounded-full overflow-hidden flex flex-col-reverse">
        <!-- Stacked Segments -->
        <!-- Physical (Bottom) -->
        <div 
          class="bg-emerald-500 w-full transition-all duration-700 ease-out"
          :style="{ height: getRelativeHeight(stat.physical) }"
        ></div>
        
        <!-- Mental (Middle) -->
        <div 
          class="bg-indigo-500 w-full transition-all duration-700 ease-out"
          :style="{ height: getRelativeHeight(stat.mental) }"
        ></div>

        <!-- Social (Top) -->
        <div 
          class="bg-amber-500 w-full transition-all duration-700 ease-out"
          :style="{ height: getRelativeHeight(stat.social) }"
        ></div>
        
        <!-- Overlay Glow for total active bar -->
        <div 
           v-if="stat.count > 0"
           class="absolute inset-0 bg-white/5 pointer-events-none"
        ></div>
      </div>

      <!-- Label -->
      <span class="text-[10px] text-foreground-muted font-mono" :class="{'text-white': stat.count > 0}">
        {{ getDayLabel(stat.date) }}
      </span>
    </div>
  </div>
</template>
