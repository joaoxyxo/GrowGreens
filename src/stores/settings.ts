import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { SettingsState } from '@/types/models'
import { getMeta, setMeta } from '@/lib/db/meta'

const DEFAULT: SettingsState = {
  onboardingComplete: false,
  profileName: '',
  zoneCode: 'litoral_norte',
  goal: '',
  space: '',
  experience: '',
  theme: 'system',
  notificationsEnabled: false,
}

export const useSettingsStore = defineStore('settings', () => {
  const state = ref<SettingsState>({ ...DEFAULT })
  const loaded = ref(false)

  async function load() {
    const saved = await getMeta<SettingsState>('settings', DEFAULT)
    state.value = { ...DEFAULT, ...saved }
    loaded.value = true
    applyTheme()
  }

  function applyTheme() {
    const t = state.value.theme
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = t === 'dark' || (t === 'system' && prefersDark)
    root.classList.toggle('dark', dark)
  }

  watch(
    state,
    (v) => {
      if (loaded.value) setMeta('settings', v)
      applyTheme()
    },
    { deep: true },
  )

  function completeOnboarding(data: Partial<SettingsState>) {
    state.value = { ...state.value, ...data, onboardingComplete: true }
  }

  return { state, loaded, load, completeOnboarding, applyTheme }
})
