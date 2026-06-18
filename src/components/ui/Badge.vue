<script setup lang="ts">
defineProps<{ tone?: 'green' | 'neutral' | 'warning' | 'sky' | 'earth'; icon?: string }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="[
      tone === 'warning' ? 'bg-warning/15 text-warning' : '',
      tone === 'sky' ? 'bg-sky-400/15 text-sky-500' : '',
      tone === 'earth' ? 'bg-earth-100 text-earth-700 dark:bg-earth-500/20 dark:text-earth-300' : '',
      tone === 'neutral' ? 'bg-neutral-100 text-neutral-600 dark:bg-dark-surface2 dark:text-neutral-300' : '',
      !tone || tone === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : '',
    ]"
  >
    <span v-if="icon" aria-hidden="true">{{ icon }}</span>
    <slot />
  </span>
</template>
