<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useLiveQuery } from '@/composables/useLiveQuery'
import { db } from '@/lib/db/dexie'
import { challengeRepo } from '@/repositories'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { MICROGREENS, MICROGREENS_BY_SLUG, CHALLENGE_DAYS } from '@/data/microgreens'
import { achievementToast } from '@/data/achievements'
import { daysSince } from '@/utils/date'
import { computeUnlockedDay, challengeDayState } from '@/utils/challenge'
import { compressImage } from '@/utils/image'
import { safe } from '@/utils/safe'

const progress = useProgressStore()
const ui = useUiStore()

const runs = useLiveQuery(() => db.challengeRuns.toArray(), [])
const run = computed(() => runs.value.find((r) => !r.finished) ?? runs.value.slice(-1)[0])

const selectedVariety = ref('rabanete')
const openDay = ref<number | null>(null)

const currentDay = computed(() => (run.value ? Math.min(7, daysSince(run.value.startedAt)) : 0))
// Os dias desbloqueiam com o tempo real de calendário OU à medida que concluis cada
// passo — assim podes avançar ao teu ritmo sem ficar preso à espera de 7 dias.
const unlockedDay = computed(() => computeUnlockedDay(currentDay.value, run.value?.completedDays ?? []))
const progressPct = computed(() => ((run.value?.completedDays.length ?? 0) / 8) * 100)
const variety = computed(() =>
  run.value ? MICROGREENS_BY_SLUG[run.value.varietySlug] : MICROGREENS_BY_SLUG[selectedVariety.value],
)

// Nota específica da variedade para um dado dia (demolha no dia 0, blackout no dia 2/3)
function varietyNote(day: number): string | null {
  const v = variety.value
  if (!v) return null
  if (day === 0 && v.soakHours > 0) {
    return `${v.name}: sementes grandes — deixa-as de molho em água ${v.soakHours}h antes de semear.`
  }
  if (day === 2 && v.blackoutDays[1] >= 4) {
    return `${v.name} precisa de um pouco mais de escuro (até ${v.blackoutDays[1]} dias). Se ainda estiverem pálidas, espera mais um dia tapado.`
  }
  if (day === 6 || day === 7) {
    return `${v.name}: ponto de colheita habitual aos ${v.daysToHarvest[0]}–${v.daysToHarvest[1]} dias.`
  }
  return null
}

async function start() {
  await challengeRepo.start(selectedVariety.value)
  progress.touchStreak()
  if (progress.unlock('semeador')) ui.toast(achievementToast('semeador'))
  openDay.value = 0
  ui.toast('Desafio iniciado! Boa sementeira 🌱')
}

function dayState(day: number) {
  return challengeDayState(day, unlockedDay.value, run.value?.completedDays ?? [])
}

const fileInput = ref<HTMLInputElement | null>(null)
const pendingDay = ref<number | null>(null)

function triggerPhoto(day: number) {
  pendingDay.value = day
  fileInput.value?.click()
}

async function onPhoto(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file && pendingDay.value !== null && run.value) {
    const blob = await compressImage(file)
    await markDone(pendingDay.value, blob)
  }
  input.value = ''
}

async function markDone(day: number, photo?: Blob) {
  if (!run.value) return
  // Defesa: não permitir concluir um dia ainda trancado (saltar à frente).
  if (dayState(day) === 'locked') return
  const ok = await safe(() => challengeRepo.completeDay(run.value!.id, day, photo))
  if (ok === undefined) return
  progress.addXp(10)
  if (day >= 7) {
    if (progress.unlock('primeira_colheita')) ui.toast(achievementToast('primeira_colheita'))
    else ui.toast('Parabéns pela colheita! 🌿')
  } else {
    ui.toast('+10 XP · feito! 🌱')
  }
  openDay.value = null
}

function resetChallenge() {
  if (run.value && confirm('Recomeçar o desafio? O progresso atual será apagado.')) {
    challengeRepo.reset(run.value.id)
  }
}

async function shareHarvest() {
  // Lazy-load: o código de canvas/partilha só é carregado ao partilhar.
  const { buildAchievementCard, shareOrDownload } = await import('@/utils/share')
  const card = await buildAchievementCard({
    title: 'Cultivei microgreens em 7 dias!',
    subtitle: `${variety.value?.name ?? 'Microgreens'} · da semente ao prato`,
    emoji: variety.value?.emoji ?? '🌱',
  })
  if (card)
    await shareOrDownload(card, 'growgreens-colheita.png', 'A minha primeira colheita com a GrowGreens 🌱')
}
</script>

<template>
  <div>
    <PageHeader title="Desafio Microgreens" subtitle="Da semente ao prato em 7 dias" />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onPhoto"
    />

    <div class="px-4 pb-10">
      <!-- Sem desafio: escolher variedade -->
      <template v-if="!run">
        <AppCard class="mb-4">
          <p class="text-sm text-neutral-600 dark:text-neutral-300">
            Vais cultivar microgreens em casa e colhê-los em cerca de uma semana. Precisas de:
            <strong>sementes, um tabuleiro raso, substrato</strong> (ou fibra de coco), água e uma janela com
            luz. Podes começar com menos de 20€.
          </p>
          <p class="mt-2 rounded-xl bg-warning/10 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200">
            ⚠️ <strong>Segurança:</strong> cultiva só microgreens de variedades comestíveis (as desta lista).
            Evita microgreens de solanáceas (tomate, batata, beringela, pimento) e de feijão comum — as
            plântulas são tóxicas.
          </p>
        </AppCard>

        <h2 class="mb-2 font-semibold">Escolhe a tua semente</h2>
        <div class="grid gap-3">
          <button
            v-for="m in MICROGREENS"
            :key="m.slug"
            class="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition"
            :class="
              selectedVariety === m.slug
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="selectedVariety = m.slug"
          >
            <span class="text-2xl" aria-hidden="true">{{ m.emoji }}</span>
            <span class="flex-1">
              <span class="font-medium">{{ m.name }}</span>
              <span
                v-if="m.beginner"
                class="ml-2 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs text-green-700 dark:text-green-300"
                >recomendado</span
              >
              <span class="block text-xs text-neutral-500 dark:text-neutral-400">
                {{ m.flavour }} · {{ m.daysToHarvest[0] }}–{{ m.daysToHarvest[1] }} dias<template
                  v-if="m.soakHours > 0"
                >
                  · 💧 demolha {{ m.soakHours }}h</template
                >
              </span>
            </span>
          </button>
        </div>
        <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{{ variety?.note }}</p>
        <BaseButton block class="mt-5" @click="start">Começar o desafio 🌱</BaseButton>
      </template>

      <!-- Desafio em curso -->
      <template v-else>
        <AppCard class="mb-5">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-display text-lg font-bold">{{ variety?.emoji }} {{ variety?.name }}</p>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">
                Dia {{ currentDay }} de 7 · {{ run.completedDays.length }}/8 passos
              </p>
            </div>
            <button class="text-xs text-neutral-400 underline" @click="resetChallenge">Recomeçar</button>
          </div>
          <ProgressBar :value="progressPct" />
        </AppCard>

        <div v-if="run.finished" class="mb-5">
          <AppCard>
            <div class="text-center py-2">
              <div class="text-5xl mb-2" aria-hidden="true">🎉</div>
              <h3 class="font-display text-xl font-bold">Colheita feita!</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                Cultivaste comida do zero em 7 dias. Pronto para o próximo passo?
              </p>
              <div class="mt-4 flex flex-col gap-2">
                <BaseButton @click="shareHarvest">📸 Partilhar a minha colheita</BaseButton>
                <RouterLink to="/catalogo">
                  <BaseButton block variant="secondary">Explorar o catálogo →</BaseButton>
                </RouterLink>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Trilho dos dias -->
        <div class="space-y-3">
          <div v-for="d in CHALLENGE_DAYS" :key="d.day">
            <button
              class="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition"
              :class="[
                dayState(d.day) === 'done'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface',
                dayState(d.day) === 'locked' ? 'opacity-50' : '',
              ]"
              :disabled="dayState(d.day) === 'locked'"
              @click="openDay = openDay === d.day ? null : d.day"
            >
              <span
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                :class="
                  dayState(d.day) === 'done'
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-100 dark:bg-dark-surface2 text-neutral-600 dark:text-neutral-300'
                "
              >
                <span v-if="dayState(d.day) === 'done'">✓</span>
                <span v-else>{{ d.day }}</span>
              </span>
              <span class="flex-1">
                <span class="block font-medium text-sm">{{ d.title }}</span>
                <span class="block text-xs text-neutral-500 dark:text-neutral-400">{{ d.phase }}</span>
              </span>
              <span class="text-neutral-400" aria-hidden="true">{{ openDay === d.day ? '▲' : '▼' }}</span>
            </button>

            <!-- Detalhe do dia -->
            <div
              v-if="openDay === d.day"
              class="mt-2 rounded-2xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface p-4"
            >
              <p class="text-sm text-neutral-700 dark:text-neutral-200">{{ d.tell }}</p>
              <ul class="mt-3 space-y-1.5">
                <li v-for="(t, i) in d.tasks" :key="i" class="flex gap-2 text-sm">
                  <span class="text-green-600">{{ i + 1 }}.</span><span>{{ t }}</span>
                </li>
              </ul>
              <div
                v-if="varietyNote(d.day)"
                class="mt-3 rounded-xl bg-green-100 dark:bg-green-900/30 px-3 py-2 text-xs text-green-800 dark:text-green-200"
              >
                <strong>{{ variety?.emoji }} Para a tua variedade:</strong> {{ varietyNote(d.day) }}
              </div>
              <div
                class="mt-3 rounded-xl bg-warning/10 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200"
              >
                <strong>⚠️ Atenção:</strong> {{ d.warning }}
              </div>
              <div v-if="dayState(d.day) !== 'done'" class="mt-4 flex gap-2">
                <BaseButton size="sm" block @click="markDone(d.day)">Marcar como feito</BaseButton>
                <BaseButton v-if="d.askPhoto" size="sm" variant="secondary" @click="triggerPhoto(d.day)">
                  📷 Foto
                </BaseButton>
              </div>
              <p v-else class="mt-3 text-sm font-medium text-green-600">✓ Concluído</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
