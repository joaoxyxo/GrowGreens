<script setup lang="ts">
const props = withDefaults(defineProps<{ value: number; max?: number; color?: string }>(), {
  max: 100,
  color: 'green',
})
const pct = () => Math.min(100, Math.max(0, (props.value / props.max) * 100))
const barClass: Record<string, string> = {
  green: 'bg-green-500',
  sun: 'bg-sun-400',
  sky: 'bg-sky-400',
  flame: 'bg-flame-500',
}
</script>

<template>
  <div class="h-2 w-full rounded-full bg-neutral-200 dark:bg-dark-surface2 overflow-hidden">
    <div
      class="h-full rounded-full transition-all duration-500"
      :class="barClass[color] ?? 'bg-green-500'"
      :style="{ width: pct() + '%' }"
    />
  </div>
</template>
