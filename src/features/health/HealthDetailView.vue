<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { NUTRIENT_GROUPS_BY_CODE, HEALTH_DISCLAIMER } from '@/data/health'
import { getPlant } from '@/data/plants'

const route = useRoute()
const group = computed(() => NUTRIENT_GROUPS_BY_CODE[route.params.code as string])
</script>

<template>
  <div v-if="group">
    <PageHeader :title="group.name" back />
    <div class="px-4 pb-10">
      <div class="text-6xl text-center mb-4" aria-hidden="true">{{ group.emoji }}</div>

      <AppCard class="mb-4">
        <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">Porque faz bem</h2>
        <ul class="space-y-2">
          <li v-for="(w, i) in group.whyGood" :key="i" class="flex gap-2 text-sm">
            <span class="text-green-600">✓</span><span>{{ w }}</span>
          </li>
        </ul>
      </AppCard>

      <AppCard class="mb-4">
        <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">Nutrientes principais</h2>
        <div v-for="(n, i) in group.nutrients" :key="i" class="border-b border-neutral-100 dark:border-dark-surface2 py-2 last:border-0">
          <p class="text-sm font-medium">{{ n.nutrient }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ n.effect }}</p>
        </div>
      </AppCard>

      <AppCard class="mb-4 bg-green-50 dark:bg-green-900/20">
        <p class="text-sm"><strong>💡 Dica:</strong> {{ group.tip }}</p>
      </AppCard>

      <AppCard v-if="group.caution" class="mb-4 bg-warning/5 border-warning/30">
        <p class="text-sm"><strong>⚠️ Atenção:</strong> {{ group.caution }}</p>
      </AppCard>

      <h2 class="mb-2 font-display text-lg font-bold">Cultiva este grupo</h2>
      <div class="flex flex-wrap gap-2">
        <RouterLink
          v-for="slug in group.plants"
          :key="slug"
          :to="`/planta/${slug}`"
          class="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300"
        >
          <span aria-hidden="true">{{ getPlant(slug)?.emoji }}</span> {{ getPlant(slug)?.name ?? slug }}
        </RouterLink>
      </div>

      <p class="mt-6 text-xs text-neutral-400 dark:text-neutral-500">{{ HEALTH_DISCLAIMER }}</p>
    </div>
  </div>
  <div v-else>
    <PageHeader title="Saúde" back />
    <EmptyState emoji="🤔" title="Grupo não encontrado" />
  </div>
</template>
