<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { journalService } from '../services/journalService';
import type { JournalEntry } from '../db/db';
import JournalEntryEditor from '../components/journal/JournalEntry.vue';
import AppCard from '../components/ui/AppCard.vue';

const latestEntires = ref<JournalEntry[]>([]);
const today = new Date().toISOString().substring(0, 10);

onMounted(() => {
    journalService.getRecentEntries(10).subscribe(entries => {
        // Filter out today from history to avoid duplication if we show editor for today
        latestEntires.value = entries.filter(e => e.date !== today);
    });
});

const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};
</script>

<template>
  <div class="px-6 pt-12 pb-24">
    <header class="mb-8 animate-slide-up-fade">
      <h1 class="text-4xl font-semibold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
        Journal
      </h1>
      <p class="text-foreground-muted mt-2">Capture your thoughts.</p>
    </header>

    <div class="space-y-8 animate-slide-up-fade [animation-delay:100ms] opacity-0 fill-mode-forwards">
      
      <!-- Editor -->
      <JournalEntryEditor :date="today" />

      <!-- History -->
      <div v-if="latestEntires.length > 0">
          <h3 class="font-semibold text-lg mb-4 pl-1">Recent Entries</h3>
          <div class="space-y-3">
              <AppCard 
                v-for="entry in latestEntires" 
                :key="entry.id"
                class="group cursor-pointer hover:bg-white/[0.04] transition-colors"
              >
                 <div class="flex gap-4">
                     <div class="flex flex-col items-center min-w-[3rem] border-r border-white/5 pr-4 py-1">
                         <span class="text-xs text-foreground-muted uppercase">{{ getDayName(entry.date) }}</span>
                         <span class="text-xl font-bold">{{ getRelativeDate(entry.date).split(' ')[1] }}</span>
                     </div>
                     <div class="flex-grow py-1">
                         <p class="text-sm text-foreground-subtle line-clamp-2 leading-relaxed">
                             {{ entry.content }}
                         </p>
                     </div>
                 </div>
              </AppCard>
          </div>
      </div>

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
