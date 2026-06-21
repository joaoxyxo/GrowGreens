<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SYMPTOMS } from '@/data/troubleshoot'

const openSymptom = ref<string | null>(null)
function toggleSymptom(idVal: string) {
  openSymptom.value = openSymptom.value === idVal ? null : idVal
}

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const analysing = ref(false)
const showResult = ref(false)

function pick() {
  fileInput.value?.click()
}
function onPhoto(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) {
    previewUrl.value = URL.createObjectURL(f)
    analysing.value = true
    showResult.value = false
    setTimeout(() => {
      analysing.value = false
      showResult.value = true
    }, 1200)
  }
}
</script>

<template>
  <div>
    <PageHeader title="Diagnóstico por foto" subtitle="A planta não está bem?" back />
    <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onPhoto" />

    <div class="px-4 pb-10">
      <AppCard class="mb-4 bg-sun-400/10 border-sun-400/30">
        <p class="text-sm">
          <strong>🔬 Funcionalidade em pré-lançamento.</strong> O diagnóstico automático por inteligência
          artificial estará disponível em breve. Para já, podes tirar a foto e usar o nosso guia de problemas
          comuns por baixo.
        </p>
      </AppCard>

      <!-- Captura guiada -->
      <AppCard class="mb-4">
        <h2 class="mb-2 font-semibold">Como tirar a melhor foto</h2>
        <ul class="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
          <li>📸 Aproxima-te da folha ou zona afetada.</li>
          <li>☀️ Boa luz, sem contraluz nem sombras fortes.</li>
          <li>🍃 Uma planta de cada vez, bem focada.</li>
        </ul>
        <div v-if="previewUrl" class="mt-3">
          <img :src="previewUrl" loading="lazy" decoding="async" class="h-48 w-full rounded-xl object-cover" alt="Foto da planta" />
        </div>
        <BaseButton class="mt-3" block @click="pick">📷 {{ previewUrl ? 'Tirar outra foto' : 'Tirar foto' }}</BaseButton>
      </AppCard>

      <div v-if="analysing" class="text-center text-sm text-neutral-500 py-4">A preparar a análise…</div>

      <AppCard v-if="showResult" class="mb-4">
        <p class="text-sm">
          <strong>Análise automática brevemente disponível.</strong> Entretanto, os problemas mais comuns no
          clima atlântico são fúngicos. Vê o guia abaixo.
        </p>
      </AppCard>

      <!-- Resolução por sintomas (sem IA) -->
      <h2 class="mb-1 font-display text-lg font-bold">O que se passa com a tua planta?</h2>
      <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Escolhe o que estás a ver — sem termos complicados.</p>
      <div class="space-y-2">
        <div v-for="s in SYMPTOMS" :key="s.id">
          <button
            class="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-4 py-3 text-left"
            @click="toggleSymptom(s.id)"
          >
            <span class="text-2xl" aria-hidden="true">{{ s.emoji }}</span>
            <span class="flex-1 text-sm font-medium">{{ s.label }}</span>
            <span class="text-neutral-400" aria-hidden="true">{{ openSymptom === s.id ? '▲' : '▼' }}</span>
          </button>
          <div
            v-if="openSymptom === s.id"
            class="mt-2 rounded-2xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface p-4"
          >
            <p class="text-sm"><strong>Provavelmente:</strong> {{ s.likely }}</p>
            <ul class="mt-2 space-y-1.5">
              <li v-for="(t, i) in s.whatToDo" :key="i" class="flex gap-2 text-sm">
                <span class="text-green-600">✓</span><span>{{ t }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
