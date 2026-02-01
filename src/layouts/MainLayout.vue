<script setup lang="ts">
import BottomNav from '../components/BottomNav.vue';
import TheBackground from '../components/ui/TheBackground.vue';
</script>

<template>
  <div class="min-h-screen text-foreground relative">
    <TheBackground />
    
    <!-- Main Content Area -->
    <!-- Added pb-32 to account for floating dock -->
    <main class="relative z-10 mx-auto max-w-lg min-h-screen pb-32">
      <router-view></router-view>
    </main>
    
    <BottomNav />
  </div>
</template>
