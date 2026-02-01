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
  const date = new Date(dateStr);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  // If showing many days (e.g. 30), maybe just show date number every few days?
  // But standard labels are fine if scrollable.
  // For 30 days, showing '12' (day of month) might be better than 'M' (day of week) to track where you are.
  if (props.data.length > 10) {
      return date.getDate().toString();
  }
  return days[date.getDay()];
};

// Calculate height percentage relative to total max
const getRelativeHeight = (value: number) => {
  return `${(value / maxCount.value) * 100}%`;
};
</script>

<template>
  <div class="overflow-x-auto pb-2 scrollbar-hide">
    <div class="flex items-end h-32 px-2 pt-4 pb-2" :class="data.length > 15 ? 'w-max gap-3 pr-6' : 'justify-between w-full'">
        <div 
        v-for="stat in data" 
        :key="stat.date" 
        class="flex flex-col items-center gap-2 group w-8 flex-shrink-0"
        >
        <!-- Tooltip -->
        <div class="opacity-0 group-hover:opacity-100 absolute translate-y-[-40px] z-10 bg-background-elevated border border-white/10 px-2 py-1 rounded text-[10px] transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            <div class="font-semibold text-center mb-0.5">{{ stat.count }} tasks</div>
            <div class="flex gap-2 text-foreground-muted justify-center">
                <div class="flex items-center gap-0.5"><div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{{ stat.physical }}</div>
                <div class="flex items-center gap-0.5"><div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>{{ stat.mental }}</div>
                <div class="flex items-center gap-0.5"><div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>{{ stat.social }}</div>
            </div>
            <div class="text-[9px] text-foreground-subtle text-center mt-1 border-t border-white/5 pt-0.5">{{ stat.date }}</div>
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
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
