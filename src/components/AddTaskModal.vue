<script setup lang="ts">
import { ref } from 'vue';
import { type TaskPillar } from '../db/db';
import AppButton from './ui/AppButton.vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'save']);

const title = ref('');
const selectedPillar = ref<TaskPillar>('Physical');
const pillars: TaskPillar[] = ['Physical', 'Mental', 'Social'];

const save = () => {
  if (!title.value.trim()) return;
  emit('save', {
    title: title.value,
    pillar: selectedPillar.value,
    frequency: 'daily'
  });
  title.value = ''; // Reset
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-background-deep/80 backdrop-blur-sm transition-opacity" 
          @click="emit('close')"
        ></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-md bg-background-elevated border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 transform transition-all animate-slide-up pb-10 sm:pb-6">
          
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">New Habit</h2>
            <button @click="emit('close')" class="text-foreground-muted hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>

          <form @submit.prevent="save">
            <!-- Title Input -->
            <div class="mb-6">
              <label class="block text-xs font-mono tracking-widest text-foreground-subtle uppercase mb-2">Habit Name</label>
              <input 
                v-model="title"
                type="text" 
                placeholder="e.g. Read 10 pages" 
                class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                autofocus
              />
            </div>

            <!-- Pillar Selection -->
            <div class="mb-8">
              <label class="block text-xs font-mono tracking-widest text-foreground-subtle uppercase mb-3">Pillar</label>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  v-for="pillar in pillars" 
                  :key="pillar"
                  type="button"
                  @click="selectedPillar = pillar"
                  class="flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200"
                  :class="selectedPillar === pillar ? 'bg-accent/10 border-accent text-accent ring-1 ring-accent/50' : 'bg-surface border-white/5 text-foreground-muted hover:bg-surface-hover'"
                >
                  <span class="text-sm font-medium">{{ pillar }}</span>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <AppButton full-width type="submit" :disabled="!title.trim()">
              Create Habit
            </AppButton>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
