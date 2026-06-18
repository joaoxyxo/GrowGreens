<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { LESSONS } from '@/data/course'
import { useProgressStore } from '@/stores/progress'
import type { LessonStep } from '@/types/catalog'

const router = useRouter()
const progress = useProgressStore()

// Reúne perguntas das lições JÁ concluídas (repetição espaçada do que se aprendeu)
function buildReview(): LessonStep[] {
  const done = new Set(progress.state.completedLessons)
  const pool: LessonStep[] = []
  for (const l of LESSONS) {
    if (!done.has(l.id)) continue
    for (const s of l.steps) {
      if (s.kind === 'choice' || s.kind === 'truefalse') pool.push(s)
    }
  }
  // baralhar e escolher até 5
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 5)
}

const questions = ref<LessonStep[]>(buildReview())
const index = ref(0)
const selected = ref<number | null>(null)
const checked = ref(false)
const correctCount = ref(0)
const finished = ref(false)

const q = computed(() => questions.value[index.value])
const total = computed(() => questions.value.length)

function check() {
  checked.value = true
  if (selected.value === q.value.correctIndex) correctCount.value++
}
function next() {
  if (index.value < total.value - 1) {
    index.value++
    selected.value = null
    checked.value = false
  } else {
    const bonus = correctCount.value * 5
    if (bonus > 0) progress.addXp(bonus)
    finished.value = true
  }
}
function leave() {
  router.push('/curso')
}
</script>

<template>
  <div class="flex min-h-screen flex-col px-5 py-5 safe-top safe-bottom">
    <div class="flex items-center gap-3">
      <button class="text-neutral-400 text-xl" aria-label="Sair" @click="leave">✕</button>
      <ProgressBar :value="finished ? total : index + 1" :max="Math.max(total, 1)" color="sun" />
    </div>

    <!-- Sem material -->
    <div v-if="!total" class="flex flex-1 flex-col items-center justify-center text-center">
      <div class="text-5xl mb-3" aria-hidden="true">📚</div>
      <h2 class="font-display text-xl font-bold">Ainda não há o que rever</h2>
      <p class="text-sm text-neutral-500 mt-1">Conclui algumas lições primeiro.</p>
      <BaseButton class="mt-6" @click="leave">Ir para o curso</BaseButton>
    </div>

    <!-- Fim -->
    <div v-else-if="finished" class="flex flex-1 flex-col items-center justify-center text-center">
      <div class="text-6xl mb-3" aria-hidden="true">🧠</div>
      <h2 class="font-display text-2xl font-bold">Revisão concluída!</h2>
      <p class="mt-2 text-neutral-600 dark:text-neutral-300">
        Acertaste {{ correctCount }} de {{ total }}.
      </p>
      <span class="mt-3 rounded-full bg-sun-400/15 px-3 py-1 text-sm font-semibold text-sun-500"
      >+{{ correctCount * 5 }} XP de revisão</span
      >
      <BaseButton class="mt-8" block @click="leave">Concluir</BaseButton>
    </div>

    <!-- Pergunta -->
    <div v-else class="flex flex-1 flex-col">
      <div class="flex-1 pt-8">
        <p class="text-xs font-semibold uppercase tracking-wide text-sun-500 mb-2">Revisão rápida</p>
        <h2 class="font-display text-xl font-bold mb-5">{{ q.question }}</h2>
        <div class="grid gap-3">
          <button
            v-for="(o, i) in q.options"
            :key="i"
            class="rounded-2xl border-2 px-4 py-3 text-left font-medium transition"
            :class="[
              !checked && selected === i ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-neutral-200 dark:border-dark-surface2',
              checked && i === q.correctIndex ? 'border-green-500 bg-green-100 dark:bg-green-900/40' : '',
              checked && selected === i && i !== q.correctIndex ? 'border-error bg-error/10' : '',
            ]"
            :disabled="checked"
            @click="selected = i"
          >
            {{ o }}
          </button>
        </div>
        <div
          v-if="checked"
          class="mt-5 rounded-xl px-4 py-3 text-sm"
          :class="selected === q.correctIndex ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' : 'bg-error/10 text-error'"
        >
          <strong>{{ selected === q.correctIndex ? 'Certo! ' : 'Quase. ' }}</strong>{{ q.explanation }}
        </div>
      </div>
      <div class="pt-5">
        <BaseButton v-if="!checked" block :disabled="selected === null" @click="check">Verificar</BaseButton>
        <BaseButton v-else block @click="next">{{ index < total - 1 ? 'Continuar' : 'Concluir' }}</BaseButton>
      </div>
    </div>
  </div>
</template>
