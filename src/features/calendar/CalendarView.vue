<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useSettingsStore } from '@/stores/settings'
import { calendarFor, CALENDAR_ACTION_LABELS, CLIMATE_ZONES_BY_CODE, MONTHLY_TIPS } from '@/data/calendar'
import { getPlant } from '@/data/plants'
import { MONTH_NAMES, currentMonth } from '@/utils/date'
import { useWeather, weatherTypeInfo, wateringAdvice, ZONE_TO_IPMA } from '@/composables/useWeather'
import type { CalendarAction } from '@/types/catalog'

const settings = useSettingsStore()
const month = ref(currentMonth())
const { forecast, loading, error, fetchFor } = useWeather()

const zone = computed(() => CLIMATE_ZONES_BY_CODE[settings.state.zoneCode])
const place = computed(() => ZONE_TO_IPMA[settings.state.zoneCode]?.place ?? 'Portugal')

const sections: { action: CalendarAction; title: string }[] = [
  { action: 'sementeira_interior', title: 'Semear em interior' },
  { action: 'sementeira_direta', title: 'Semear (direto)' },
  { action: 'transplante', title: 'Transplantar' },
  { action: 'colheita', title: 'Colher' },
]

function plantsFor(action: CalendarAction) {
  return calendarFor(settings.state.zoneCode, month.value)
    .filter((e) => e.action === action)
    .map((e) => getPlant(e.plant))
    .filter(Boolean)
}

const advice = computed(() => wateringAdvice(forecast.value))

function prevMonth() {
  month.value = month.value === 1 ? 12 : month.value - 1
}
function nextMonth() {
  month.value = month.value === 12 ? 1 : month.value + 1
}

onMounted(() => fetchFor(settings.state.zoneCode))
watch(() => settings.state.zoneCode, (z) => fetchFor(z))
</script>

<template>
  <div>
    <PageHeader title="Calendário" :subtitle="zone?.name" />
    <div class="px-4 pb-10">
      <!-- Meteorologia IPMA -->
      <AppCard class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-sky-500">Tempo em {{ place }}</h2>
          <span class="text-xs text-neutral-400">IPMA</span>
        </div>
        <div v-if="loading" class="text-sm text-neutral-500 py-2">A obter a previsão…</div>
        <div v-else-if="error" class="text-sm text-neutral-500 py-2">
          Sem ligação à meteorologia agora. A previsão aparece quando estiveres online.
        </div>
        <div v-else-if="forecast.length">
          <div class="flex gap-3 overflow-x-auto no-scrollbar">
            <div
              v-for="(d, i) in forecast"
              :key="d.date"
              class="flex-shrink-0 w-16 text-center rounded-xl bg-neutral-50 dark:bg-dark-surface2 py-2"
            >
              <p class="text-xs text-neutral-500">{{ i === 0 ? 'Hoje' : d.date.slice(8, 10) + '/' + d.date.slice(5, 7) }}</p>
              <p class="text-xl" aria-hidden="true">{{ weatherTypeInfo(d.weatherType).emoji }}</p>
              <p class="text-xs font-semibold">{{ Math.round(d.tMax) }}°</p>
              <p class="text-[10px] text-neutral-400">{{ Math.round(d.tMin) }}°</p>
            </div>
          </div>
          <p v-if="advice" class="mt-3 rounded-lg bg-sky-400/10 px-3 py-2 text-sm text-sky-600 dark:text-sky-300">
            {{ advice }}
          </p>
        </div>
      </AppCard>

      <!-- Seletor de mês -->
      <div class="flex items-center justify-between mb-4">
        <button class="rounded-full bg-neutral-100 dark:bg-dark-surface2 px-3 py-1.5 text-lg" aria-label="Mês anterior" @click="prevMonth">‹</button>
        <h2 class="font-display text-xl font-bold">{{ MONTH_NAMES[month - 1] }}</h2>
        <button class="rounded-full bg-neutral-100 dark:bg-dark-surface2 px-3 py-1.5 text-lg" aria-label="Mês seguinte" @click="nextMonth">›</button>
      </div>

      <!-- Dica do mês -->
      <AppCard class="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/40">
        <p class="text-sm"><strong>🌿 Este mês:</strong> {{ MONTHLY_TIPS[month] }}</p>
      </AppCard>

      <!-- Nota de geada por zona -->
      <AppCard v-if="zone" class="mb-4 bg-sky-400/5 border-sky-400/30">
        <p class="text-sm">
          <strong>❄️ Geada em {{ zone.name }}:</strong>
          última provável por volta de {{ MONTH_NAMES[zone.lastFrostMonth - 1] }}; primeira por volta de
          {{ MONTH_NAMES[zone.firstFrostMonth - 1] }}. Protege as culturas sensíveis ao frio fora desta janela.
        </p>
      </AppCard>

      <!-- Secções -->
      <div class="space-y-5">
        <section v-for="s in sections" :key="s.action">
          <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            <span aria-hidden="true">{{ CALENDAR_ACTION_LABELS[s.action].emoji }}</span> {{ s.title }}
          </h3>
          <div v-if="plantsFor(s.action).length" class="flex flex-wrap gap-2">
            <RouterLink
              v-for="p in plantsFor(s.action)"
              :key="p!.slug"
              :to="`/planta/${p!.slug}`"
              class="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-surface2 px-3 py-1.5 text-sm font-medium"
            >
              <span aria-hidden="true">{{ p!.emoji }}</span> {{ p!.name }}
            </RouterLink>
          </div>
          <p v-else class="text-sm text-neutral-400">Nada a destacar este mês.</p>
        </section>
      </div>
    </div>
  </div>
</template>
