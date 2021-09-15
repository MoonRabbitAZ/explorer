import { useI18n } from 'vue-i18n'

export function useGlobalTranslation () {
  const { t } = useI18n({ useScope: 'global' })

  return {
    globalize: t,
  }
}
