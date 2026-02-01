<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false
});

const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-accent hover:bg-accent-bright text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_6px_20px_rgba(94,106,210,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] rounded-lg';
    case 'secondary':
      return 'bg-surface hover:bg-surface-hover text-foreground border border-white/10 shadow-sm hover:border-white/20 rounded-lg';
    case 'ghost':
      return 'bg-transparent hover:bg-surface text-foreground-muted hover:text-foreground rounded-lg';
    default:
      return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs h-8 px-3 rounded-md';
    case 'md':
      return 'text-sm h-10 px-4 rounded-lg';
    case 'lg':
      return 'text-base h-12 px-6 rounded-xl';
    default:
      return '';
  }
});
</script>

<template>
  <button :class="[baseClasses, variantClasses, sizeClasses, fullWidth ? 'w-full' : '']">
    <slot></slot>
  </button>
</template>
