<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { LESSONS_BY_ID } from '@/data/course'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()

const lesson = computed(() => LESSONS_BY_ID[route.params.id as string])
const index = ref(0)
const step = computed(() => lesson.value?.steps[index.value])
const total = computed(() => lesson.value?.steps.length ?? 1)

const selected = ref<number | null>(null)
const checked = ref(false)
const orderPick = ref<number[]>([])
const finished = ref(false)

const isCorrect = computed(() => {
  if (!step.value) return false
  if (step.value.kind === 'choice' || step.value.kind === 'truefalse') {
    return selected.value === step.value.correctIndex
  }
  if (step.value.kind === 'order') {
    return JSON.stringify(orderPick.value) === JSON.stringify(step.value.correctOrder)
  }
  return true
})

const needsAnswer = computed(() =>
  step.value ? ['choice', 'truefalse', 'order'].includes(step.value.kind) : false,
)

const canProceed = computed(() => {
  if (!needsAnswer.value) return true
  return checked.value
})

function pickOrder(i: number) {
  if (checked.value) return
  if (orderPick.value.includes(i)) orderPick.value = orderPick.value.filter((x) => x !== i)
  else orderPick.value.push(i)
}

function check() {
  checked.value = true
}

function next() {
  if (index.value < total.value - 1) {
    index.value++
    selected.value = null
    checked.value = false
    orderPick.value = []
  } else {
    complete()
  }
}

function complete() {
  const lid = lesson.value!.id
  const isNew = progress.completeLesson(lid, lesson.value!.xp)
  if (isNew) {
    if (progress.state.completedLessons.length === 1) progress.unlock('aprendiz')
    if (progress.state.completedLessons.length >= 10) progress.unlock('estudioso')
    if (progress.state.streak >= 7) progress.unlock('constante')
    if (lid === 'l5-1' || lid === 'l5-2') progress.unlock('caca_fungos')
  }
  finished.value = true
}

function leave() {
  router.push('/curso')
}
</script>

<template>
  <div v-if="lesson" class="flex min-h-screen flex-col px-5 py-5 safe-top safe-bottom">
    <!-- Topo -->
    <div class="flex items-center gap-3">
      <button class="text-neutral-400 text-xl" aria-label="Sair" @click="leave">✕</button>
      <ProgressBar :value="finished ? total : index + 1" :max="total" />
    </div>

    <!-- Fim -->
    <div v-if="finished" class="flex flex-1 flex-col items-center justify-center text-center">
      <div class="text-6xl mb-3" aria-hidden="true">🎉</div>
      <h2 class="font-display text-2xl font-bold">Lição concluída!</h2>
      <div class="mt-3 flex gap-2">
        <span class="rounded-full bg-sun-400/15 px-3 py-1 text-sm font-semibold text-sun-500">+{{ lesson.xp }} XP</span>
        <span class="rounded-full bg-flame-500/10 px-3 py-1 text-sm font-semibold text-flame-500">🔥 {{ progress.state.streak }}</span>
      </div>
      <BaseButton class="mt-8" block @click="leave">Continuar</BaseButton>
    </div>

    <!-- Passo -->
    <div v-else class="flex flex-1 flex-col">
      <div class="flex-1 pt-8">
        <!-- Conceito -->
        <template v-if="step?.kind === 'concept'">
          <div v-if="step.emoji" class="text-5xl mb-4" aria-hidden="true">{{ step.emoji }}</div>
          <h2 class="font-display text-2xl font-bold mb-3">{{ step.title }}</h2>
          <p class="text-neutral-700 dark:text-neutral-200 leading-relaxed">{{ step.body }}</p>
        </template>

        <!-- Escolha / V-F -->
        <template v-else-if="step?.kind === 'choice' || step?.kind === 'truefalse'">
          <h2 class="font-display text-xl font-bold mb-5">{{ step.question }}</h2>
          <div class="grid gap-3">
            <button
              v-for="(o, i) in step.options"
              :key="i"
              class="rounded-2xl border-2 px-4 py-3 text-left font-medium transition"
              :class="[
                !checked && selected === i ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-neutral-200 dark:border-dark-surface2',
                checked && i === step.correctIndex ? 'border-green-500 bg-green-100 dark:bg-green-900/40' : '',
                checked && selected === i && i !== step.correctIndex ? 'border-error bg-error/10' : '',
              ]"
              :disabled="checked"
              @click="selected = i"
            >
              {{ o }}
            </button>
          </div>
        </template>

        <!-- Ordenar -->
        <template v-else-if="step?.kind === 'order'">
          <h2 class="font-display text-xl font-bold mb-2">{{ step.question }}</h2>
          <p class="text-sm text-neutral-500 mb-4">Toca pela ordem correta.</p>
          <div class="grid gap-2">
            <button
              v-for="(item, i) in step.items"
              :key="i"
              class="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-medium transition"
              :class="orderPick.includes(i) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-neutral-200 dark:border-dark-surface2'"
              :disabled="checked"
              @click="pickOrder(i)"
            >
              <span
                v-if="orderPick.includes(i)"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white"
              >{{ orderPick.indexOf(i) + 1 }}</span>
              <span v-else class="h-6 w-6 rounded-full border border-neutral-300 dark:border-dark-surface2"></span>
              {{ item }}
            </button>
          </div>
        </template>

        <!-- Resumo -->
        <template v-else-if="step?.kind === 'summary'">
          <div class="text-4xl mb-3" aria-hidden="true">✅</div>
          <h2 class="font-display text-xl font-bold mb-4">Para levar contigo</h2>
          <ul class="space-y-3">
            <li
              v-for="(b, i) in step.bullets"
              :key="i"
              class="flex gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 px-3 py-2.5 text-sm"
            >
              <span class="text-green-600">✓</span><span>{{ b }}</span>
            </li>
          </ul>
        </template>

        <!-- Feedback -->
        <div
          v-if="checked && needsAnswer"
          class="mt-5 rounded-xl px-4 py-3 text-sm"
          :class="isCorrect ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' : 'bg-error/10 text-error'"
        >
          <strong>{{ isCorrect ? 'Certo! ' : 'Quase. ' }}</strong>{{ step?.explanation }}
        </div>
      </div>

      <!-- Ações -->
      <div class="pt-5">
        <BaseButton
          v-if="needsAnswer && !checked"
          block
          :disabled="selected === null && orderPick.length === 0"
          @click="check"
        >
          Verificar
        </BaseButton>
        <BaseButton v-else block :disabled="!canProceed" @click="next">
          {{ index < total - 1 ? 'Continuar' : 'Concluir' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
