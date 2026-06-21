<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import PlantCard from '@/components/PlantCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { PLANTS } from '@/data/plants'
import { plantSowableThisMonth } from '@/data/calendar'
import { useSettingsStore } from '@/stores/settings'
import { currentMonth } from '@/utils/date'
import { normalize } from '@/utils/text'
import type { PlantCategory, Difficulty } from '@/types/catalog'

const settings = useSettingsStore()
const query = ref('')
// Debounce ligeiro: o filtro só corre 150 ms depois de parar de escrever.
const debouncedQuery = ref('')
let queryTimer: ReturnType<typeof setTimeout> | undefined
watch(query, (q) => {
  clearTimeout(queryTimer)
  queryTimer = setTimeout(() => {
    debouncedQuery.value = q
  }, 150)
})
const catFilter = ref<PlantCategory | 'todas'>('todas')
const diffFilter = ref<Difficulty | 'todas'>('todas')
const locFilter = ref<'todas' | 'interior' | 'exterior'>('todas')
const sowableOnly = ref(false)

const sowableSet = computed(() => plantSowableThisMonth(settings.state.zoneCode, currentMonth()))

const categories: { v: PlantCategory | 'todas'; label: string }[] = [
  { v: 'todas', label: 'Todas' },
  { v: 'folha', label: 'Folhas' },
  { v: 'brassica', label: 'Brássicas' },
  { v: 'raiz', label: 'Raízes' },
  { v: 'fruto', label: 'Frutos' },
  { v: 'leguminosa', label: 'Leguminosas' },
  { v: 'aromatica', label: 'Aromáticas' },
]


// Índice de pesquisa pré-normalizado (uma só vez) — evita re-normalizar os textos
// de todas as plantas a cada tecla premida.
const searchBlob = new Map(
  PLANTS.map((p) => [p.slug, normalize(`${p.name} ${p.scientificName} ${p.shortDescription}`)]),
)

const results = computed(() => {
  const q = normalize(debouncedQuery.value.trim())
  return PLANTS.filter((p) => {
    if (q && !searchBlob.get(p.slug)!.includes(q)) return false
    if (catFilter.value !== 'todas' && p.category !== catFilter.value) return false
    if (diffFilter.value !== 'todas' && p.difficulty !== diffFilter.value) return false
    if (locFilter.value === 'interior' && p.location === 'exterior') return false
    if (locFilter.value === 'exterior' && p.location === 'interior') return false
    if (sowableOnly.value && !sowableSet.value.has(p.slug)) return false
    return true
  })
})
</script>

<template>
  <div>
    <PageHeader title="Catálogo" subtitle="Descobre o que cultivar" back />
    <div class="px-4 pb-10">
      <!-- Pesquisa -->
      <div class="relative mb-3">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">🔍</span>
        <input
          v-model="query"
          type="search"
          placeholder="Procurar planta (ex.: tomate, rúcula)…"
          class="w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Filtros -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          v-for="c in categories"
          :key="c.v"
          class="flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition"
          :class="catFilter === c.v ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-neutral-200 dark:border-dark-surface2 text-neutral-600 dark:text-neutral-300'"
          @click="catFilter = c.v"
        >
          {{ c.label }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-1 mb-4">
        <button
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="sowableOnly ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-neutral-200 dark:border-dark-surface2 text-neutral-600 dark:text-neutral-300'"
          @click="sowableOnly = !sowableOnly"
        >
          🌱 Semear este mês
        </button>
        <button
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="diffFilter === 'facil' ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-neutral-200 dark:border-dark-surface2 text-neutral-600 dark:text-neutral-300'"
          @click="diffFilter = diffFilter === 'facil' ? 'todas' : 'facil'"
        >
          ⭐ Fáceis
        </button>
        <button
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="locFilter === 'interior' ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-neutral-200 dark:border-dark-surface2 text-neutral-600 dark:text-neutral-300'"
          @click="locFilter = locFilter === 'interior' ? 'todas' : 'interior'"
        >
          🏠 Interior
        </button>
      </div>

      <!-- Resultados -->
      <div v-if="results.length" class="grid grid-cols-2 gap-3 [content-visibility:auto] [contain-intrinsic-size:auto_140px]">
        <PlantCard
          v-for="p in results"
          :key="p.slug"
          v-memo="[p.slug, sowableSet.has(p.slug)]"
          :plant="p"
          :sowable="sowableSet.has(p.slug)"
        />
      </div>
      <EmptyState
        v-else
        emoji="🔍"
        title="Sem resultados"
        description="Tenta outra pesquisa ou remove alguns filtros."
      />
    </div>
  </div>
</template>
