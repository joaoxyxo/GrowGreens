import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './assets/styles/main.css'

import { useSettingsStore } from './stores/settings'
import { useProgressStore } from './stores/progress'
import { useUiStore } from './stores/ui'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(i18n)

  // Carregar estado persistido antes de montar
  const settings = useSettingsStore()
  const progress = useProgressStore()
  await Promise.all([settings.load(), progress.load()])

  app.mount('#app')

  // PWA: prompt de atualização (sem recarregar a meio de uma tarefa)
  const ui = useUiStore()
  registerSW({
    onNeedRefresh() {
      ui.needsRefresh = true
    },
  })

  // Reagir a mudança de tema do sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    settings.applyTheme()
  })
}

bootstrap()
