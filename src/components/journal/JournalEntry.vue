<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { journalService } from '../../services/journalService';
import AppCard from '../ui/AppCard.vue';

const props = defineProps<{
  date: string;
}>();

const content = ref('');
const isSaving = ref(false);
let saveTimeout: any = null;

// Load initial data
onMounted(() => {
    loadContent();
});

const loadContent = () => {
   const sub = journalService.getEntry(props.date).subscribe(entry => {
       if (entry && content.value === '') { 
           content.value = entry.content;
       }
       // We only want to load it once initially, or keep it synced? 
       // If we keep it synced, typing might conflict with incoming updates if not careful.
       // For a simple editor, one-off load is safer.
       sub.unsubscribe();
   });
};

watch(() => props.date, () => {
    content.value = ''; // Reset
    loadContent();
}, { immediate: true });

const handleInput = () => {
    isSaving.value = true;
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(async () => {
        await journalService.saveEntry(props.date, content.value);
        isSaving.value = false;
    }, 1000); // 1s debounce
};
</script>

<template>
  <AppCard class="flex flex-col min-h-[50vh] transition-colors focus-within:bg-white/[0.04]">
    <div class="flex justify-between items-center mb-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <span class="text-xs font-mono text-foreground-muted uppercase tracking-widest">{{ new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'}) }}</span>
        <span class="text-[10px] text-foreground-muted transition-opacity duration-500" :class="isSaving ? 'opacity-100' : 'opacity-0'">Saving...</span>
    </div>
    
    <textarea
        v-model="content"
        @input="handleInput"
        class="w-full flex-grow bg-transparent border-none text-lg leading-relaxed resize-none focus:outline-none focus:ring-0 placeholder:text-foreground-muted/30"
        placeholder="What's on your mind?..."
    ></textarea>
  </AppCard>
</template>
