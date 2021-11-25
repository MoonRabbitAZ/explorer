import { createI18n } from 'vue-i18n'

const STORAGE_KEY = 'locale'
const DEFAULT_LOCALE = 'en'

const locale = localStorage && localStorage.getItem(STORAGE_KEY)
  ? localStorage.getItem(STORAGE_KEY)
  : DEFAULT_LOCALE

const i18n = createI18n({
  locale,
  fallbackLocale: locale,
  silentFallbackWarn: true,
  globalInjection: true,
  messages: {
    ...require('./resources.js').default,
  },
})

export { i18n }
