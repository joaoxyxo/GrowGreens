import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-PT',
  fallbackLocale: 'pt-PT',
  messages: { 'pt-PT': pt },
})
