<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { quoteService, type Quote } from '../services/quoteService';
import AppCard from './ui/AppCard.vue';

const quote = ref<Quote | null>(null);

onMounted(() => {
    quote.value = quoteService.getDailyQuote();
});
</script>

<template>
  <AppCard v-if="quote" variant="glass" class="mb-6 relative overflow-hidden group">
    <!-- Subtle Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
    
    <!-- Quote Content -->
    <div class="relative z-10 flex flex-col gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-white/20 mb-1"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path></svg>
        
        <p class="text-lg font-medium text-foreground leading-relaxed italic opacity-90">
            "{{ quote.text }}"
        </p>
        
        <div class="h-px w-8 bg-white/10 my-1"></div>
        
        <span class="text-xs font-mono tracking-widest text-foreground-muted uppercase">
            {{ quote.author }}
        </span>
    </div>

    <!-- Decorative Shine -->
    <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
  </AppCard>
</template>
