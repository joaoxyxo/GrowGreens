<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { CLIMATE_ZONES } from '@/data/calendar'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const router = useRouter()
const settings = useSettingsStore()

// Pré-carrega o chunk do Desafio (destino ao terminar o onboarding) para uma
// transição instantânea. Mesmo specifier do router → mesmo chunk (deduplicado).
onMounted(() => {
  import('@/features/microgreens/ChallengeView.vue').catch(() => {})
})

const step = ref(0)
const name = ref('')
const goal = ref('')
const space = ref('')
const experience = ref('')
const zone = ref('litoral_norte')

const goals = [
  { v: 'saudavel', label: 'Comer mais saudável', emoji: '🥗' },
  { v: 'poupar', label: 'Poupar nas compras', emoji: '💶' },
  { v: 'hobby', label: 'Um hobby relaxante', emoji: '😌' },
  { v: 'familia', label: 'Ensinar a família', emoji: '👨‍👩‍👧' },
]
const spaces = [
  { v: 'parapeito', label: 'Parapeito de janela', emoji: '🪟' },
  { v: 'varanda', label: 'Varanda', emoji: '🏢' },
  { v: 'quintal', label: 'Quintal / terraço', emoji: '🌳' },
  { v: 'interior', label: 'Só interior', emoji: '🏠' },
]
const experiences = [
  { v: 'nunca', label: 'Nunca cultivei nada', emoji: '🌱' },
  { v: 'tentei', label: 'Já tentei, sem grande sucesso', emoji: '🥀' },
  { v: 'alguma', label: 'Cultivo de vez em quando', emoji: '🌿' },
]

const totalSteps = 5
const canNext = computed(() => {
  switch (step.value) {
    case 0:
      return true
    case 1:
      return !!goal.value
    case 2:
      return !!space.value
    case 3:
      return !!experience.value
    case 4:
      return !!zone.value
    default:
      return true
  }
})

function next() {
  if (step.value < totalSteps - 1) {
    step.value++
  } else {
    finish()
  }
}
function back() {
  if (step.value > 0) step.value--
}
// Respostas recolhidas até agora (com o que estiver preenchido + defaults).
function answers() {
  return {
    profileName: name.value.trim(),
    goal: goal.value,
    space: space.value,
    experience: experience.value,
    zoneCode: zone.value,
  }
}

function finish() {
  settings.completeOnboarding(answers())
  router.push('/desafio')
}

// Saltar a introdução: conclui o onboarding e vai direto à homepage. As
// preferências podem ser ajustadas depois no Perfil.
function skip() {
  settings.completeOnboarding(answers())
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col px-5 py-6 safe-top safe-bottom">
    <!-- Saltar a introdução e ir direto para a app -->
    <div class="mb-2 flex justify-end">
      <button
        class="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-green-600 dark:text-neutral-400"
        @click="skip"
      >
        Saltar →
      </button>
    </div>

    <ProgressBar v-if="step > 0" :value="step" :max="totalSteps - 1" class="mb-6" />

    <div class="flex-1">
      <!-- 0: Boas-vindas -->
      <div v-if="step === 0" class="flex flex-col items-center text-center pt-10">
        <div class="text-7xl mb-4" aria-hidden="true">🌱</div>
        <h1 class="font-display text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Bem-vindo à GrowGreens
        </h1>
        <p class="mt-3 text-neutral-600 dark:text-neutral-300 max-w-sm">
          Vais aprender a cultivar comida em casa, da semente à colheita. E começamos com uma vitória:
          microgreens prontos a comer em <strong>7 dias</strong>.
        </p>
        <div class="mt-6 w-full max-w-sm text-left">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >Como te chamas? (opcional)</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="O teu nome"
            class="mt-1 w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <!-- 1: Objetivo -->
      <div v-else-if="step === 1">
        <h2 class="font-display text-2xl font-bold mb-1">Qual é o teu objetivo?</h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-5 text-sm">
          Ajuda-nos a personalizar a tua experiência.
        </p>
        <div class="grid gap-3">
          <button
            v-for="o in goals"
            :key="o.v"
            class="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition"
            :class="
              goal === o.v
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="goal = o.v"
          >
            <span class="text-2xl" aria-hidden="true">{{ o.emoji }}</span>
            <span class="font-medium">{{ o.label }}</span>
          </button>
        </div>
      </div>

      <!-- 2: Espaço -->
      <div v-else-if="step === 2">
        <h2 class="font-display text-2xl font-bold mb-1">Onde vais cultivar?</h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-5 text-sm">Qualquer espaço serve para começar.</p>
        <div class="grid gap-3">
          <button
            v-for="o in spaces"
            :key="o.v"
            class="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition"
            :class="
              space === o.v
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="space = o.v"
          >
            <span class="text-2xl" aria-hidden="true">{{ o.emoji }}</span>
            <span class="font-medium">{{ o.label }}</span>
          </button>
        </div>
      </div>

      <!-- 3: Experiência -->
      <div v-else-if="step === 3">
        <h2 class="font-display text-2xl font-bold mb-1">Que experiência tens?</h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-5 text-sm">
          Não há resposta errada — começamos onde estiveres.
        </p>
        <div class="grid gap-3">
          <button
            v-for="o in experiences"
            :key="o.v"
            class="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition"
            :class="
              experience === o.v
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="experience = o.v"
          >
            <span class="text-2xl" aria-hidden="true">{{ o.emoji }}</span>
            <span class="font-medium">{{ o.label }}</span>
          </button>
        </div>
      </div>

      <!-- 4: Região -->
      <div v-else-if="step === 4">
        <h2 class="font-display text-2xl font-bold mb-1">Onde vives em Portugal?</h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-5 text-sm">
          O clima muda o que e quando podes semear. Podes mudar depois.
        </p>
        <div class="grid gap-3">
          <button
            v-for="z in CLIMATE_ZONES"
            :key="z.code"
            class="rounded-2xl border-2 px-4 py-4 text-left transition"
            :class="
              zone === z.code
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 dark:border-dark-surface2'
            "
            @click="zone = z.code"
          >
            <div class="font-medium">{{ z.name }}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{{ z.description }}</div>
          </button>
        </div>
      </div>
    </div>

    <div class="pt-6 flex items-center gap-3">
      <BaseButton v-if="step > 0" variant="ghost" size="sm" @click="back">Voltar</BaseButton>
      <BaseButton block :disabled="!canNext" @click="next">
        {{ step === 0 ? 'Começar' : step === totalSteps - 1 ? 'Iniciar o desafio 🌱' : 'Continuar' }}
      </BaseButton>
    </div>
  </div>
</template>
