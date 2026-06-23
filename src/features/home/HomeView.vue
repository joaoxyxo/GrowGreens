<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { useReminders } from '@/composables/useReminders'
import { db } from '@/lib/db/dexie'
import { PLANTING_STATUS } from '@/types/models'
import { remindersRepo, plantingsRepo } from '@/repositories'
import { getPlant } from '@/data/plants'
import { LESSONS } from '@/data/course'
import { plantSowableThisMonth } from '@/data/calendar'
import { recommendPlants, shouldSuggestMicrogreens } from '@/utils/recommend'
import { defaultWateringDays } from '@/utils/growth'
import { currentMonth, MONTH_NAMES, isOverdue, isDueToday } from '@/utils/date'
import StatChip from '@/components/ui/StatChip.vue'
import AppCard from '@/components/ui/AppCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const settings = useSettingsStore()
const progress = useProgressStore()
const ui = useUiStore()

const reminders = useReminders()
const plantings = useLiveQuery(() => db.plantings.where('status').equals(PLANTING_STATUS.ACTIVE).toArray(), [])
const challenge = useLiveQuery(() => db.challengeRuns.toArray(), [])

const greeting = computed(() => {
  const h = new Date().getHours()
  const part = h < 12 ? 'Bom dia' : h < 20 ? 'Boa tarde' : 'Boa noite'
  return settings.state.profileName ? `${part}, ${settings.state.profileName}` : part
})

const todayReminders = computed(() =>
  reminders.value
    .filter((r) => !r.done && (isOverdue(r.dueAt) || isDueToday(r.dueAt)))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
)

const activeChallenge = computed(() => challenge.value.find((c) => !c.finished))

const nextLesson = computed(() => {
  return LESSONS.find((l) => !progress.state.completedLessons.includes(l.id)) ?? null
})

const courseProgress = computed(() =>
  Math.round((progress.state.completedLessons.length / LESSONS.length) * 100),
)

const sowable = computed(() => {
  const slugs = [...plantSowableThisMonth(settings.state.zoneCode, currentMonth())]
  return slugs.map((s) => getPlant(s)).filter(Boolean).slice(0, 6)
})

// Recomendações personalizadas (mostradas enquanto a horta está pouco povoada)
const recommendations = computed(() =>
  plantings.value.length < 3 ? recommendPlants(settings.state, 3) : [],
)

// Em interior sem nada semeável este mês, sugerir microgreens (colheita garantida em ~1 semana).
const suggestMicrogreens = computed(
  () => recommendations.value.length === 0 && shouldSuggestMicrogreens(settings.state),
)

// Pré-carrega chunks de destinos frequentes a partir do Home, em segundo plano.
onMounted(() => {
  import('@/features/catalog/CatalogView.vue').catch(() => {})
  import('@/features/course/CourseView.vue').catch(() => {})
})

async function addRecommended(slug: string) {
  const plant = getPlant(slug)
  if (!plant) return
  const waterEvery = defaultWateringDays(plant.waterNeed)
  await plantingsRepo.create({
    plantSlug: slug,
    nickname: plant.name,
    location: settings.state.space || 'varanda',
    wateringEveryDays: waterEvery,
  })
  progress.touchStreak()
  progress.unlock('semeador')
  ui.toast(`${plant.name} adicionada 🌱`)
}

// Hero: a ação única mais importante para hoje
const hero = computed(() => {
  if (activeChallenge.value) {
    return { title: 'Continua o teu desafio dos microgreens', cta: 'Ver a tarefa de hoje', to: '/desafio', emoji: '🌱' }
  }
  if (todayReminders.value.length) {
    const r = todayReminders.value[0]
    return { title: r.label, cta: 'Tratar agora', to: '/jardim', emoji: '💧', reminderId: r.id }
  }
  if (nextLesson.value) {
    return { title: `Lição: ${nextLesson.value.title}`, cta: 'Aprender (3 min)', to: `/curso/licao/${nextLesson.value.id}`, emoji: '📗' }
  }
  return null
})

async function completeReminder(id: string) {
  await remindersRepo.complete(id)
  progress.touchStreak()
  ui.toast('Tarefa feita! 🌿')
}

// Notifica (uma vez por sessão) se houver tarefas pendentes e as notificações estiverem ativas
let notified = false
watch(
  todayReminders,
  (list) => {
    if (notified || !list.length) return
    if (
      settings.state.notificationsEnabled &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      notified = true
      const n = list.length
      new Notification('GrowGreens 🌱', {
        body: n === 1 ? list[0].label : `Tens ${n} tarefas de horta para hoje.`,
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="px-4 pt-6 safe-top">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ greeting }} 👋</h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Faz boa horta hoje.</p>
      </div>
      <div class="flex gap-2">
        <StatChip icon="🔥" :value="progress.state.streak" tone="flame" label="Sequência de dias" />
        <StatChip icon="⭐" :value="progress.state.xp" tone="sun" label="XP" />
      </div>
    </div>

    <!-- Hero: o que faço hoje -->
    <RouterLink v-if="hero" :to="hero.to" class="mt-5 block">
      <div class="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-5 text-white shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-white/80">O que faço hoje</p>
        <div class="mt-1 flex items-center gap-3">
          <span class="text-4xl" aria-hidden="true">{{ hero.emoji }}</span>
          <div class="flex-1">
            <p class="font-display text-lg font-bold leading-tight">{{ hero.title }}</p>
          </div>
        </div>
        <div class="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold">
          {{ hero.cta }} →
        </div>
      </div>
    </RouterLink>

    <!-- Tarefas de hoje -->
    <section class="mt-6">
      <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Tarefas de hoje
      </h2>
      <AppCard v-if="todayReminders.length" :padded="false">
        <ul class="divide-y divide-neutral-100 dark:divide-dark-surface2">
          <li v-for="r in todayReminders" :key="r.id" class="flex items-center gap-3 px-4 py-3">
            <button
              class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 text-green-600 transition hover:bg-green-50"
              :aria-label="`Concluir: ${r.label}`"
              @click="completeReminder(r.id)"
            >
              <span class="text-xs">✓</span>
            </button>
            <span class="flex-1 text-sm">{{ r.label }}</span>
            <span v-if="isOverdue(r.dueAt)" class="text-xs font-medium text-error">atrasada</span>
            <span v-else class="text-xs text-sky-500">💧 hoje</span>
          </li>
        </ul>
      </AppCard>
      <AppCard v-else>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 text-center py-2">
          Sem tarefas para hoje. Tudo em dia! 🌿
        </p>
      </AppCard>
    </section>

    <!-- Continuar lição -->
    <section v-if="nextLesson" class="mt-6">
      <RouterLink :to="`/curso/licao/${nextLesson.id}`">
        <AppCard>
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-green-600">Continuar a aprender</p>
            <span class="text-xs text-neutral-500">{{ courseProgress }}%</span>
          </div>
          <p class="font-semibold">{{ nextLesson.title }}</p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{{ nextLesson.subtitle }}</p>
          <ProgressBar :value="courseProgress" />
        </AppCard>
      </RouterLink>
    </section>

    <!-- As minhas plantas -->
    <section class="mt-6">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          As minhas plantas
        </h2>
        <RouterLink to="/jardim" class="text-sm font-medium text-green-600">Ver tudo</RouterLink>
      </div>
      <div v-if="plantings.length" class="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        <RouterLink
          v-for="p in plantings"
          :key="p.id"
          :to="`/jardim/${p.id}`"
          class="flex-shrink-0 w-28 rounded-2xl bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-surface2 p-3 text-center"
        >
          <div class="text-3xl" aria-hidden="true">{{ getPlant(p.plantSlug)?.emoji ?? '🌱' }}</div>
          <p class="mt-1 text-xs font-medium truncate">{{ p.nickname }}</p>
        </RouterLink>
      </div>
      <AppCard v-else>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 text-center py-1">
          Ainda não tens plantas.
          <RouterLink to="/catalogo" class="font-medium text-green-600">Descobre o que cultivar →</RouterLink>
        </p>
      </AppCard>
    </section>

    <!-- Sugeridas para ti -->
    <section v-if="recommendations.length" class="mt-6">
      <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Sugeridas para ti
      </h2>
      <div class="space-y-2">
        <AppCard v-for="p in recommendations" :key="p.slug">
          <div class="flex items-center gap-3">
            <RouterLink :to="`/planta/${p.slug}`" class="text-3xl" aria-hidden="true">{{ p.emoji }}</RouterLink>
            <div class="flex-1 min-w-0">
              <RouterLink :to="`/planta/${p.slug}`" class="font-semibold">{{ p.name }}</RouterLink>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{{ p.shortDescription }}</p>
            </div>
            <button
              class="flex-shrink-0 rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-white"
              :aria-label="`Adicionar ${p.name} à minha horta`"
              @click="addRecommended(p.slug)"
            >
              ＋
            </button>
          </div>
        </AppCard>
      </div>
    </section>

    <!-- Sugestão de microgreens (interior, nada semeável agora) -->
    <section v-if="suggestMicrogreens" class="mt-6">
      <RouterLink to="/desafio" class="block">
        <AppCard>
          <div class="flex items-center gap-3">
            <span class="text-3xl" aria-hidden="true">🌱</span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold">Experimenta microgreens</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                Em interior e sem nada para semear agora? Os microgreens crescem todo o ano dentro de
                casa e dão colheita em ~1 semana.
              </p>
            </div>
          </div>
        </AppCard>
      </RouterLink>
    </section>

    <!-- Este mês -->
    <section class="mt-6">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Semear em {{ MONTH_NAMES[currentMonth() - 1] }}
        </h2>
        <RouterLink to="/calendario" class="text-sm font-medium text-green-600">Calendário</RouterLink>
      </div>
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <RouterLink
          v-for="p in sowable"
          :key="p!.slug"
          :to="`/planta/${p!.slug}`"
          class="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300"
        >
          <span aria-hidden="true">{{ p!.emoji }}</span> {{ p!.name }}
        </RouterLink>
        <RouterLink
          v-if="!sowable.length"
          to="/desafio"
          class="text-sm text-neutral-500"
        >
          Mês mais calmo para semear ao ar livre — que tal microgreens? Dão o ano todo, em casa. 🌱
        </RouterLink>
      </div>
    </section>
  </div>
</template>
