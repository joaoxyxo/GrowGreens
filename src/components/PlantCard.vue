<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Plant } from '@/types/catalog'
import DifficultyDots from '@/components/ui/DifficultyDots.vue'
import Badge from '@/components/ui/Badge.vue'

defineProps<{ plant: Plant; sowable?: boolean }>()
</script>

<template>
  <RouterLink
    :to="`/planta/${plant.slug}`"
    class="group block rounded-2xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-surface2 shadow-sm overflow-hidden transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
  >
    <div
      class="aspect-square flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-dark-surface2 dark:to-dark-surface text-6xl"
    >
      <span aria-hidden="true">{{ plant.emoji }}</span>
    </div>
    <div class="p-3">
      <div class="flex items-center justify-between gap-1">
        <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{{ plant.name }}</h3>
        <Badge v-if="sowable" tone="green" icon="🌱">agora</Badge>
      </div>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 italic truncate">{{ plant.scientificName }}</p>
      <div class="mt-2 flex items-center justify-between">
        <DifficultyDots :level="plant.difficulty" />
        <span class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ plant.daysToHarvest[0] }}–{{ plant.daysToHarvest[1] }}d
        </span>
      </div>
    </div>
  </RouterLink>
</template>
