<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import Badge from '@/components/ui/Badge.vue'
import DifficultyDots from '@/components/ui/DifficultyDots.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getPlant } from '@/data/plants'
import { PESTS_BY_SLUG, DISEASES_BY_SLUG } from '@/data/pestsDiseases'
import { recipesForPlant } from '@/data/recipes'
import { calendarForPlant as calendarForPlantZone, CALENDAR_ACTION_LABELS } from '@/data/calendar'
import { plantingsRepo } from '@/repositories'
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { MONTH_NAMES, fmtDate, addDaysISO, todayISO } from '@/utils/date'
import { defaultWateringDays, successionDays } from '@/utils/growth'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()
const progress = useProgressStore()
const ui = useUiStore()

const plant = computed(() => getPlant(route.params.slug as string))

const sunLabels: Record<string, string> = {
  sol_pleno: 'Sol pleno',
  meia_sombra: 'Meia-sombra',
  sombra: 'Sombra',
}
const locLabels: Record<string, string> = { interior: 'Interior', exterior: 'Exterior', ambos: 'Interior e exterior' }

const plantCalendar = computed(() =>
  plant.value ? calendarForPlantZone(plant.value.slug, settings.state.zoneCode) : [],
)

const recipes = computed(() => (plant.value ? recipesForPlant(plant.value.slug) : []))

// Sugestão de sementeira em sucessão (culturas de corte rápidas).
const succession = computed(() => {
  if (!plant.value) return null
  const days = successionDays(plant.value.slug)
  if (!days) return null
  return { days, nextDate: fmtDate(addDaysISO(todayISO(), days)) }
})

// Modal de adicionar
const showAdd = ref(false)
const nickname = ref('')
const location = ref('varanda')
const waterEvery = ref(3)

function openAdd() {
  if (!plant.value) return
  nickname.value = plant.value.name
  waterEvery.value = defaultWateringDays(plant.value.waterNeed)
  showAdd.value = true
}

async function confirmAdd() {
  if (!plant.value) return
  await plantingsRepo.create({
    plantSlug: plant.value.slug,
    nickname: nickname.value.trim() || plant.value.name,
    location: location.value,
    wateringEveryDays: waterEvery.value,
  })
  progress.touchStreak()
  if (progress.unlock('semeador')) ui.toast('Conquista: Semeador 🪴')
  ui.toast(`${plant.value.name} adicionada à tua horta 🌱`)
  showAdd.value = false
  router.push('/jardim')
}
</script>

<template>
  <div v-if="plant">
    <PageHeader :title="plant.name" back />
    <div class="px-4 pb-28">
      <!-- Hero -->
      <div
        class="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-dark-surface2 dark:to-dark-surface text-7xl"
      >
        <span aria-hidden="true">{{ plant.emoji }}</span>
      </div>
      <p class="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400">
        {{ plant.scientificName }} · {{ plant.family }}
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <DifficultyDots :level="plant.difficulty" />
        <Badge tone="neutral">{{ locLabels[plant.location] }}</Badge>
        <Badge v-if="plant.beginnerFriendly" tone="green" icon="✨">Boa para começar</Badge>
        <Badge v-if="!plant.frostTolerant" tone="warning" icon="❄️">Sensível à geada</Badge>
      </div>

      <p class="mt-4 text-neutral-700 dark:text-neutral-200">{{ plant.shortDescription }}</p>

      <!-- Em 30 segundos -->
      <AppCard class="mt-4">
        <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">Em 30 segundos</h2>
        <ul class="space-y-1.5">
          <li v-for="(b, i) in plant.in30Seconds" :key="i" class="flex gap-2 text-sm">
            <span aria-hidden="true">•</span><span>{{ b }}</span>
          </li>
        </ul>
      </AppCard>

      <!-- Factos rápidos -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <AppCard>
          <p class="text-xs text-neutral-500">⏱️ Colheita</p>
          <p class="font-semibold">{{ plant.daysToHarvest[0] }}–{{ plant.daysToHarvest[1] }} dias</p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-neutral-500">☀️ Luz</p>
          <p class="font-semibold">{{ sunLabels[plant.sunExposure] }}</p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-neutral-500">💧 Rega</p>
          <p class="font-semibold capitalize">{{ plant.waterNeed }}</p>
        </AppCard>
        <AppCard>
          <p class="text-xs text-neutral-500">🪴 Vaso mínimo</p>
          <p class="font-semibold">{{ plant.potVolumeL }} L</p>
        </AppCard>
      </div>

      <!-- Detalhes técnicos -->
      <AppCard class="mt-3">
        <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">Detalhes de sementeira</h2>
        <dl class="grid grid-cols-2 gap-y-2 text-sm">
          <dt class="text-neutral-500">Germinação</dt>
          <dd v-if="plant.daysToGerminate" class="text-right font-medium">{{ plant.daysToGerminate[0] }}–{{ plant.daysToGerminate[1] }} dias</dd>
          <dd v-else class="text-right text-neutral-400">—</dd>
          <dt class="text-neutral-500">Profundidade</dt>
          <dd class="text-right font-medium">{{ plant.sowingDepthCm }} cm</dd>
          <dt class="text-neutral-500">Espaçamento</dt>
          <dd class="text-right font-medium">{{ plant.spacingCm }} cm</dd>
          <dt class="text-neutral-500">pH ideal</dt>
          <dd class="text-right font-medium">{{ plant.phRange[0] }}–{{ plant.phRange[1] }}</dd>
          <dt class="text-neutral-500">Horas de sol (mín.)</dt>
          <dd class="text-right font-medium">{{ plant.sunHoursMin }}h/dia</dd>
          <dt class="text-neutral-500">Método</dt>
          <dd class="text-right font-medium">{{ plant.sowingMethod === 'sementeira_direta' ? 'Sementeira direta' : plant.sowingMethod === 'transplante' ? 'Transplante' : plant.sowingMethod === 'bolbo' ? 'Bolbo/dente' : 'Direta ou transplante' }}</dd>
        </dl>
      </AppCard>

      <!-- Expectativas -->
      <AppCard class="mt-3 bg-sky-400/5 border-sky-400/30">
        <p class="text-sm"><strong>📅 O que esperar:</strong> {{ plant.expectations }}</p>
      </AppCard>

      <!-- Sucessão de sementeira -->
      <AppCard v-if="succession" class="mt-3 bg-green-500/5 border-green-500/30">
        <p class="text-sm">
          <strong>🔁 Semeia em sucessão:</strong> para teres colheita contínua, semeia outra leva a cada
          ~{{ succession.days }} dias. A próxima seria por volta de <strong>{{ succession.nextDate }}</strong>.
        </p>
      </AppCard>

      <!-- Calendário -->
      <section v-if="plantCalendar.length" class="mt-6">
        <h2 class="mb-2 font-display text-lg font-bold">Quando, em {{ settings.state.zoneCode === 'litoral_norte' ? 'Ovar/Aveiro' : 'Portugal' }}</h2>
        <AppCard>
          <div v-for="e in plantCalendar" :key="e.action" class="mb-2 last:mb-0">
            <p class="text-sm font-medium">
              {{ CALENDAR_ACTION_LABELS[e.action].emoji }} {{ CALENDAR_ACTION_LABELS[e.action].label }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ e.months.map((m) => MONTH_NAMES[m - 1].slice(0, 3)).join(', ') }}
            </p>
          </div>
        </AppCard>
      </section>

      <!-- Fases -->
      <section class="mt-6">
        <h2 class="mb-2 font-display text-lg font-bold">Como cultivar, fase a fase</h2>
        <div class="space-y-2">
          <AppCard v-for="s in plant.stages" :key="s.stage">
            <p class="text-sm font-semibold capitalize text-green-700 dark:text-green-300">
              {{ s.stage.replace('_', ' ') }}
              <span v-if="s.durationDays" class="font-normal text-neutral-400"
              >· {{ s.durationDays[0] }}–{{ s.durationDays[1] }} dias</span
              >
            </p>
            <p class="text-sm text-neutral-700 dark:text-neutral-200 mt-0.5">{{ s.text }}</p>
          </AppCard>
        </div>
      </section>

      <!-- Cuidados -->
      <section class="mt-6 space-y-2">
        <h2 class="mb-1 font-display text-lg font-bold">Cuidados</h2>
        <AppCard><p class="text-sm"><strong>💧 Rega:</strong> {{ plant.wateringNotes }}</p></AppCard>
        <AppCard><p class="text-sm"><strong>🌱 Nutrição:</strong> {{ plant.feedingNotes }}</p></AppCard>
        <AppCard><p class="text-sm"><strong>🧺 Colheita:</strong> {{ plant.harvestNotes }}</p></AppCard>
        <AppCard>
          <p class="text-sm">
            <strong>🌊 No litoral atlântico:</strong> {{ plant.portugalNotes }}
          </p>
        </AppCard>
        <AppCard v-if="plant.pollination !== 'nao_aplicavel'">
          <p class="text-sm">
            <strong>🐝 Polinização:</strong>
            <span v-if="plant.pollination === 'autofertil'"> Autofértil — em interior, abana a planta na floração para os frutos vingarem.</span>
            <span v-else-if="plant.pollination === 'insetos'"> Precisa de insetos. Em varanda alta, poliniza à mão.</span>
            <span v-else-if="plant.pollination === 'manual'"> Precisa de polinização manual.</span>
            <span v-else> Polinizada pelo vento.</span>
          </p>
        </AppCard>
        <AppCard v-if="plant.needsSupplementalLight">
          <p class="text-sm"><strong>💡 Luz no inverno:</strong> No inverno do litoral, a luz natural pode não chegar — um parapeito muito soalheiro ou uma luz de cultivo ajuda.</p>
        </AppCard>
      </section>

      <!-- Segurança -->
      <AppCard v-if="plant.toxicNote || !plant.petSafe" class="mt-4 border-warning/40">
        <p class="text-sm"><strong>⚠️ Segurança:</strong> {{ plant.toxicNote || 'Mantém longe de animais.' }}</p>
        <p class="text-xs text-neutral-500 mt-1">Partes comestíveis: {{ plant.edibleParts }}</p>
      </AppCard>

      <!-- Erro comum -->
      <AppCard class="mt-4 bg-warning/5 border-warning/30">
        <p class="text-sm"><strong>🚫 Erro mais comum:</strong> {{ plant.commonMistake }}</p>
      </AppCard>

      <!-- Pragas e doenças -->
      <section v-if="plant.pests.length || plant.diseases.length" class="mt-6">
        <h2 class="mb-2 font-display text-lg font-bold">Pragas e doenças a vigiar</h2>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="p in plant.pests" :key="p" tone="neutral" :icon="PESTS_BY_SLUG[p]?.emoji">
            {{ PESTS_BY_SLUG[p]?.name ?? p }}
          </Badge>
          <Badge v-for="d in plant.diseases" :key="d" tone="warning" :icon="DISEASES_BY_SLUG[d]?.emoji">
            {{ DISEASES_BY_SLUG[d]?.name ?? d }}
          </Badge>
        </div>
      </section>

      <!-- Consociação -->
      <section v-if="plant.companions.length || plant.antagonists.length" class="mt-6">
        <h2 class="mb-2 font-display text-lg font-bold">Boa e má vizinhança</h2>
        <div class="grid grid-cols-2 gap-3">
          <AppCard>
            <p class="text-xs font-semibold text-green-600 mb-1">✓ Dão-se bem</p>
            <p class="text-sm">{{ plant.companions.map((c) => getPlant(c)?.name ?? c).join(', ') || '—' }}</p>
          </AppCard>
          <AppCard>
            <p class="text-xs font-semibold text-error mb-1">✕ Evitar perto</p>
            <p class="text-sm">{{ plant.antagonists.map((c) => getPlant(c)?.name ?? c).join(', ') || '—' }}</p>
          </AppCard>
        </div>
      </section>

      <!-- Saúde + receitas -->
      <div class="mt-6 flex flex-wrap gap-3">
        <RouterLink :to="`/saude/${plant.nutrientGroup}`">
          <BaseButton variant="secondary" size="sm">❤️ Benefícios para a saúde</BaseButton>
        </RouterLink>
      </div>

      <section v-if="recipes.length" class="mt-6">
        <h2 class="mb-2 font-display text-lg font-bold">Receitas com {{ plant.name.toLowerCase() }}</h2>
        <div class="space-y-2">
          <AppCard v-for="r in recipes" :key="r.slug">
            <p class="font-medium">{{ r.emoji }} {{ r.title }}</p>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ r.description }}</p>
          </AppCard>
        </div>
      </section>
    </div>

    <!-- Barra fixa: adicionar -->
    <div class="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 dark:border-dark-surface2 bg-white/95 dark:bg-dark-bg/95 backdrop-blur p-3 safe-bottom">
      <div class="mx-auto max-w-2xl">
        <BaseButton block @click="openAdd">＋ Adicionar à minha horta</BaseButton>
      </div>
    </div>

    <!-- Modal adicionar -->
    <div
      v-if="showAdd"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center"
      @click.self="showAdd = false"
    >
      <div class="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-dark-surface p-5 safe-bottom">
        <h3 class="font-display text-lg font-bold mb-3">Adicionar {{ plant.name }}</h3>
        <label class="block text-sm font-medium mb-1">Nome (apelido)</label>
        <input
          v-model="nickname"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label class="block text-sm font-medium mb-1">Onde?</label>
        <select
          v-model="location"
          class="mb-3 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="parapeito">Parapeito</option>
          <option value="varanda">Varanda</option>
          <option value="quintal">Quintal</option>
          <option value="interior">Interior</option>
        </select>
        <label class="block text-sm font-medium mb-1">Lembrete de rega: a cada {{ waterEvery }} dias</label>
        <input v-model.number="waterEvery" type="range" min="1" max="10" class="mb-4 w-full accent-green-500" />
        <div class="flex gap-2">
          <BaseButton variant="ghost" size="sm" @click="showAdd = false">Cancelar</BaseButton>
          <BaseButton block @click="confirmAdd">Adicionar 🌱</BaseButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <PageHeader title="Planta" back />
    <EmptyState emoji="🤔" title="Planta não encontrada" description="Volta ao catálogo para escolher outra." />
  </div>
</template>
