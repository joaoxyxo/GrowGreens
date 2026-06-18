<script setup lang="ts">
import type { Difficulty } from '@/types/catalog'
const props = defineProps<{ level: Difficulty }>()
const map: Record<Difficulty, { dots: number; label: string }> = {
  facil: { dots: 1, label: 'Fácil' },
  medio: { dots: 2, label: 'Médio' },
  dificil: { dots: 3, label: 'Exigente' },
}
const info = () => map[props.level]
</script>

<template>
  <span class="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
    <span class="flex gap-0.5" aria-hidden="true">
      <span
        v-for="i in 3"
        :key="i"
        class="h-1.5 w-1.5 rounded-full"
        :class="i <= info().dots ? 'bg-green-500' : 'bg-neutral-300 dark:bg-dark-surface2'"
      />
    </span>
    {{ info().label }}
  </span>
</template>
