// Decisão (Ciclo 3): manter o vue-i18n. Está ligado no main.ts e fornece o
// scaffolding pt-PT para localização futura. A app é atualmente single-language
// (textos em pt-PT diretos), pelo que `$t()` ainda é pouco usado — mas a infra
// fica pronta para adicionar idiomas sem refactor.
import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-PT',
  fallbackLocale: 'pt-PT',
  messages: { 'pt-PT': pt },
})
