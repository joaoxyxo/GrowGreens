<script setup lang="ts">
withDefaults(defineProps<{ as?: string; padded?: boolean }>(), { as: 'div', padded: true })
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-surface2 shadow-sm"
    :class="padded ? 'p-4' : ''"
  >
    <slot />
  </component>
</template>
