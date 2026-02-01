<script setup lang="ts">
// TheBackground.vue
</script>

<template>
  <div class="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background-deep">
    <!-- Layer 1: Base Gradient -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-background-elevated)_0%,_var(--color-background-base)_50%,_var(--color-background-deep)_100%)]"></div>

    <!-- Layer 2: Animated Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent/20 blur-[120px] rounded-full mix-blend-screen animate-float opacity-30"></div>
    <div class="absolute top-1/4 left-0 w-[800px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-full mix-blend-screen animate-float [animation-delay:2s] opacity-20"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[500px] bg-purple-900/10 blur-[80px] rounded-full mix-blend-screen animate-float [animation-delay:4s] opacity-20"></div>

    <!-- Layer 3: Noise Texture -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>

    <!-- Layer 4: Grid Overlay (Optional, very subtle) -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
</template>
