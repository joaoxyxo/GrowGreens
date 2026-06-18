<script setup lang="ts">
defineProps<{ emoji: string; title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div class="text-5xl mb-3" aria-hidden="true">{{ emoji }}</div>
    <h3 class="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
      {{ description }}
    </p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
