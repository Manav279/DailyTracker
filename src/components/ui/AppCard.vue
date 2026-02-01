<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  variant?: 'default' | 'glass';
  spotlight?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  spotlight: true
});

const cardRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
const opacity = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;
  
  const rect = cardRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
  opacity.value = 1;
};

const handleMouseLeave = () => {
  opacity.value = 0;
};
</script>

<template>
  <div 
    ref="cardRef"
    class="relative group rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_2px_20px_rgba(0,0,0,0.4),0_0_40px_rgba(0,0,0,0.2)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(94,106,210,0.1)]"
    :class="[
      variant === 'glass' ? 'backdrop-blur-md bg-opacity-50' : ''
    ]"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Spotlight effect -->
    <div 
      v-if="spotlight"
      class="pointer-events-none absolute -inset-px transition opacity duration-300"
      :style="{
        opacity: opacity,
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(94, 106, 210, 0.15), transparent 40%)`
      }"
    ></div>

    <!-- Inner Highlight -->
    <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>

    <!-- Content -->
    <div class="relative z-10 p-6">
      <slot></slot>
    </div>
  </div>
</template>
