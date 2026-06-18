<script setup lang="ts">
defineProps<{ icon: string; value: string | number; label?: string; tone?: 'flame' | 'sun' | 'green' }>()
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums"
    :class="[
      tone === 'flame' ? 'bg-flame-500/10 text-flame-500' : '',
      tone === 'sun' ? 'bg-sun-400/15 text-sun-500' : '',
      tone === 'green' || !tone ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : '',
    ]"
    :title="label"
  >
    <span aria-hidden="true">{{ icon }}</span>
    <span>{{ value }}</span>
  </div>
</template>
