import { reactive } from 'vue'
import { vueRoutes } from '@/vue-router'
import { useI18n } from 'vue-i18n'

export function useMenuLinksGroups () {
  const { t } = useI18n()

  return reactive({
    accounts: {
      name: 'accounts-group',
      groupTranslationName: t('routers-groups.accounts.name'),
      links: [
        {
          translationName: t('routers-groups.accounts.routers.wallet'),
          route: vueRoutes.walletPage,
        },
      ],
    },
    temples: {
      name: 'temples-group',
      groupTranslationName: t('routers-groups.temples.name'),
      links: [
        {
          translationName: t('routers-groups.temples.routers.explorer'),
          route: vueRoutes.explorerPage,
        },
        {
          translationName: t('routers-groups.temples.routers.parachains'),
          route: vueRoutes.parachainsPage,
        },
        {
          translationName: t('routers-groups.temples.routers.event-calendar'),
          route: vueRoutes.eventCalendarPage,
        },
        {
          translationName: t('routers-groups.temples.routers.holders'),
          route: vueRoutes.holdersPage,
        },
        {
          translationName: t('routers-groups.temples.routers.map'),
          route: vueRoutes.validatorsMapPage,
        },
      ],
    },

    settings: {
      name: 'settings',
      groupTranslationName: t('routers-groups.settings.name'),
      links: [
        {
          translationName: t('routers-groups.settings.routers.settings'),
          route: vueRoutes.settingsPage,
        },
      ],
    },
  })
}
