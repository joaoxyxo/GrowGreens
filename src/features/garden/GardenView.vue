<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { db } from '@/lib/db/dexie'
import { getPlant } from '@/data/plants'
import { daysSince, isOverdue, isDueToday } from '@/utils/date'
import type { Planting } from '@/types/models'

const plantings = useLiveQuery(
  () => db.plantings.where('status').equals('ativa').reverse().sortBy('updatedAt'),
  [] as Planting[],
)
const harvested = useLiveQuery(
  () => db.plantings.where('status').equals('colhida').reverse().sortBy('updatedAt'),
  [] as Planting[],
)
const reminders = useLiveQuery(() => db.reminders.toArray(), [])
const showHistory = ref(false)

function waterState(plantingId: string): { label: string; tone: 'green' | 'sky' | 'warning' } {
  const rs = reminders.value.filter((r) => r.plantingId === plantingId && r.type === 'rega' && !r.done)
  if (rs.some((r) => isOverdue(r.dueAt))) return { label: 'Regar (atrasada)', tone: 'warning' }
  if (rs.some((r) => isDueToday(r.dueAt))) return { label: 'Regar hoje', tone: 'sky' }
  return { label: 'Em dia', tone: 'green' }
}

const count = computed(() => plantings.value.length)
</script>

<template>
  <div>
    <PageHeader title="A minha horta" :subtitle="count ? `${count} planta(s) a crescer` : undefined">
      <template #actions>
        <RouterLink to="/catalogo">
          <BaseButton size="sm">＋ Descobrir</BaseButton>
        </RouterLink>
      </template>
    </PageHeader>

    <div class="px-4 pb-10">
      <!-- Atalho para o plano (espelho digital) -->
      <RouterLink to="/jardim/plano" class="mb-4 block">
        <div class="flex items-center gap-3 rounded-2xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 px-4 py-3">
          <span class="text-2xl" aria-hidden="true">🗺️</span>
          <div class="flex-1">
            <p class="font-semibold text-sm">Plano da horta</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">Desenha os teus canteiros e vasos e marca o que plantaste.</p>
          </div>
          <span class="text-neutral-400" aria-hidden="true">→</span>
        </div>
      </RouterLink>

      <div v-if="plantings.length" class="space-y-3">
        <RouterLink
          v-for="p in plantings"
          :key="p.id"
          :to="`/jardim/${p.id}`"
          class="flex items-center gap-3 rounded-2xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-surface2 p-3 shadow-sm"
        >
          <div
            class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-dark-surface2 text-3xl"
          >
            <span aria-hidden="true">{{ getPlant(p.plantSlug)?.emoji ?? '🌱' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">{{ p.nickname }}</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ getPlant(p.plantSlug)?.name }} · dia {{ daysSince(p.sownAt) }}
            </p>
          </div>
          <Badge :tone="waterState(p.id).tone" :icon="waterState(p.id).tone === 'green' ? '✓' : '💧'">
            {{ waterState(p.id).label }}
          </Badge>
        </RouterLink>
      </div>

      <EmptyState
        v-else
        emoji="🪴"
        title="A tua horta está à espera"
        description="Adiciona a tua primeira planta — ou começa pelo desafio dos microgreens."
      >
        <div class="flex flex-col gap-2">
          <RouterLink to="/catalogo"><BaseButton>Ver catálogo</BaseButton></RouterLink>
          <RouterLink to="/desafio"><BaseButton variant="secondary">Desafio microgreens 🌱</BaseButton></RouterLink>
        </div>
      </EmptyState>

      <!-- Histórico de colheitas -->
      <div v-if="harvested.length" class="mt-6">
        <button
          class="flex w-full items-center justify-between text-sm font-semibold text-neutral-600 dark:text-neutral-300"
          @click="showHistory = !showHistory"
        >
          <span>🧺 Já colhidas ({{ harvested.length }})</span>
          <span aria-hidden="true">{{ showHistory ? '▲' : '▼' }}</span>
        </button>
        <div v-if="showHistory" class="mt-2 space-y-2">
          <div
            v-for="p in harvested"
            :key="p.id"
            class="flex items-center gap-3 rounded-xl bg-neutral-50 dark:bg-dark-surface2 px-3 py-2"
          >
            <span class="text-2xl opacity-70" aria-hidden="true">{{ getPlant(p.plantSlug)?.emoji ?? '🌱' }}</span>
            <span class="flex-1 text-sm">{{ p.nickname }}</span>
            <Badge tone="green">colhida</Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
