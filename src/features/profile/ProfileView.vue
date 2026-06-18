<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppCard from '@/components/ui/AppCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { ACHIEVEMENTS } from '@/data/achievements'
import { CLIMATE_ZONES } from '@/data/calendar'
import { LESSONS } from '@/data/course'
import { remindersRepo } from '@/repositories'
import { downloadICS } from '@/utils/ics'
import { setMeta } from '@/lib/db/meta'

const settings = useSettingsStore()
const progress = useProgressStore()
const ui = useUiStore()

const unlocked = computed(() => new Set(progress.state.achievements.map((a) => a.code)))
const levelPct = computed(() => {
  const cur = progress.level.min
  const nxt = progress.nextLevel?.min ?? cur + 1
  return Math.round(((progress.state.xp - cur) / (nxt - cur)) * 100)
})

function exportData() {
  const data = {
    settings: settings.state,
    progress: progress.state,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'growgreens-dados.json'
  a.click()
  URL.revokeObjectURL(url)
  ui.toast('Dados exportados')
}

function notify() {
  if (!('Notification' in window)) {
    ui.toast('Este dispositivo não suporta notificações', 'info')
    return
  }
  Notification.requestPermission().then((p) => {
    settings.state.notificationsEnabled = p === 'granted'
    if (p === 'granted') {
      new Notification('GrowGreens', { body: 'Lembretes ativados! Avisamos-te quando for hora de regar. 🌱' })
      ui.toast('Lembretes ativados 🔔')
    } else {
      ui.toast('Lembretes não ativados', 'info')
    }
  })
}

async function exportCalendar() {
  const reminders = await remindersRepo.all()
  const pending = reminders.filter((r) => !r.done)
  if (!pending.length) {
    ui.toast('Não tens lembretes para exportar', 'info')
    return
  }
  downloadICS(pending)
  ui.toast('Calendário (.ics) exportado')
}

async function importData(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    if (data.settings) {
      settings.state = { ...settings.state, ...data.settings }
      await setMeta('settings', settings.state)
    }
    if (data.progress) {
      progress.state = { ...progress.state, ...data.progress }
      await setMeta('progress', progress.state)
    }
    ui.toast('Dados importados ✓')
  } catch {
    ui.toast('Ficheiro inválido', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Perfil" />
    <div class="px-4 pb-10">
      <!-- Cartão de nível -->
      <AppCard class="mb-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-2xl">
            🌿
          </div>
          <div class="flex-1">
            <p class="font-display text-lg font-bold">{{ settings.state.profileName || 'Hortelão' }}</p>
            <p class="text-sm text-green-600 dark:text-green-400 font-medium">{{ progress.level.name }}</p>
          </div>
          <div class="flex flex-col items-end text-sm">
            <span class="font-semibold text-flame-500">🔥 {{ progress.state.streak }}</span>
            <span class="font-semibold text-sun-500">⭐ {{ progress.state.xp }}</span>
          </div>
        </div>
        <ProgressBar :value="levelPct" />
        <div class="mt-1 flex items-center justify-between text-xs text-neutral-500">
          <span v-if="progress.nextLevel">{{ progress.nextLevel.min - progress.state.xp }} XP até {{ progress.nextLevel.name }}</span>
          <span v-else>Nível máximo 🎉</span>
          <span :title="'Protege a tua sequência se falhares um dia'">🛡️ {{ progress.state.freezes }} proteção(ões)</span>
        </div>
      </AppCard>

      <!-- Estatísticas -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <AppCard class="text-center">
          <p class="text-2xl font-bold">{{ progress.state.completedLessons.length }}</p>
          <p class="text-xs text-neutral-500">de {{ LESSONS.length }} lições</p>
        </AppCard>
        <AppCard class="text-center">
          <p class="text-2xl font-bold">{{ progress.state.achievements.length }}</p>
          <p class="text-xs text-neutral-500">conquistas</p>
        </AppCard>
        <AppCard class="text-center">
          <p class="text-2xl font-bold">{{ progress.state.streak }}</p>
          <p class="text-xs text-neutral-500">dias seguidos</p>
        </AppCard>
      </div>

      <!-- Conquistas -->
      <h2 class="mb-2 font-display text-lg font-bold">Conquistas</h2>
      <div class="grid grid-cols-4 gap-3 mb-6">
        <div
          v-for="a in ACHIEVEMENTS"
          :key="a.code"
          class="flex flex-col items-center text-center"
          :title="a.description"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            :class="unlocked.has(a.code) ? 'bg-sun-400/15' : 'bg-neutral-100 dark:bg-dark-surface2 grayscale opacity-40'"
          >
            {{ a.emoji }}
          </div>
          <p class="mt-1 text-[10px] leading-tight text-neutral-500">{{ a.name }}</p>
        </div>
      </div>

      <!-- Atalhos -->
      <div class="space-y-2 mb-6">
        <RouterLink to="/saude">
          <AppCard><p class="text-sm font-medium">❤️ Saúde & Nutrição</p></AppCard>
        </RouterLink>
        <RouterLink to="/diagnostico">
          <AppCard><p class="text-sm font-medium">🩺 A minha planta não está bem</p></AppCard>
        </RouterLink>
        <RouterLink to="/glossario">
          <AppCard><p class="text-sm font-medium">📖 Glossário (palavras da horta)</p></AppCard>
        </RouterLink>
        <RouterLink to="/desafio">
          <AppCard><p class="text-sm font-medium">🌱 Desafio dos microgreens</p></AppCard>
        </RouterLink>
      </div>

      <!-- Definições -->
      <h2 class="mb-2 font-display text-lg font-bold">Definições</h2>
      <AppCard class="mb-2">
        <label class="block text-sm font-medium mb-1">Nome</label>
        <input
          v-model="settings.state.profileName"
          class="w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </AppCard>
      <AppCard class="mb-2">
        <label class="block text-sm font-medium mb-1">Região</label>
        <select
          v-model="settings.state.zoneCode"
          class="w-full rounded-xl border border-neutral-200 dark:border-dark-surface2 bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option v-for="z in CLIMATE_ZONES" :key="z.code" :value="z.code">{{ z.name }}</option>
        </select>
      </AppCard>
      <AppCard class="mb-2">
        <label class="block text-sm font-medium mb-1">Tema</label>
        <div class="flex gap-2">
          <button
            v-for="t in (['system', 'light', 'dark'] as const)"
            :key="t"
            class="flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition"
            :class="settings.state.theme === t ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'border-neutral-200 dark:border-dark-surface2'"
            @click="settings.state.theme = t"
          >
            {{ t === 'system' ? 'Sistema' : t === 'light' ? 'Claro' : 'Escuro' }}
          </button>
        </div>
      </AppCard>
      <AppCard class="mb-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Notificações de lembrete</span>
          <button class="text-sm font-medium text-green-600" @click="notify">
            {{ settings.state.notificationsEnabled ? 'Ativadas ✓' : 'Ativar' }}
          </button>
        </div>
        <div class="mt-2 flex items-center justify-between border-t border-neutral-100 dark:border-dark-surface2 pt-2">
          <span class="text-sm font-medium">Exportar lembretes (.ics)</span>
          <button class="text-sm font-medium text-green-600" @click="exportCalendar">Exportar</button>
        </div>
        <p class="mt-2 text-xs text-neutral-400">
          O .ics adiciona os lembretes de rega ao calendário do telemóvel — funciona em qualquer dispositivo.
        </p>
      </AppCard>

      <div class="mt-4 flex flex-col gap-2">
        <button class="text-sm text-green-600 font-medium" @click="exportData">⬇️ Exportar os meus dados (JSON)</button>
        <label class="text-sm text-green-600 font-medium cursor-pointer">
          ⬆️ Importar dados (JSON)
          <input type="file" accept="application/json" class="hidden" @change="importData" />
        </label>
        <RouterLink to="/legal" class="text-sm text-neutral-500 underline">Privacidade e termos</RouterLink>
      </div>
    </div>
  </div>
</template>
