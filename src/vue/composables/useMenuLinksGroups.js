import { reactive } from 'vue'
import { vueRoutes } from '@/vue-router'
import { useI18n } from 'vue-i18n'

export function useMenuLinksGroups () {
  const { t } = useI18n({ useScope: 'global' })

  return reactive([
    {
      name: 'accounts-group',
      groupTranslationName: t('routers-groups.accounts.name'),
      links: [
        {
          translationName: t('routers-groups.accounts.routers.wallet'),
          route: vueRoutes.walletPage,
        },
      ],
    },
    {
      name: 'temples-group',
      groupTranslationName: t('routers-groups.temples.name'),
      links: [
        {
          translationName: t('routers-groups.temples.routers.explorer'),
          route: vueRoutes.explorerPage,
        },
        {
          translationName: t('routers-groups.temples.routers.event-calendar'),
          route: vueRoutes.eventCalendarPage,
        },
      ],
    },
  ])
}
