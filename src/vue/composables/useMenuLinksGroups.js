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
        {
          translationName: t('routers-groups.accounts.routers.bridge'),
          route: vueRoutes.bridgePage,
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
          translationName: t('routers-groups.temples.routers.gilt'),
          route: vueRoutes.giltPage,
        },
        {
          translationName: t('routers-groups.temples.routers.society'),
          route: vueRoutes.societyPage,
        },
        {
          translationName: t('routers-groups.temples.routers.event-calendar'),
          route: vueRoutes.eventCalendarPage,
        },
        {
          translationName: t('routers-groups.temples.routers.map'),
          route: vueRoutes.validatorsMapPage,
        },
        {
          translationName: t('routers-groups.temples.routers.holders'),
          route: vueRoutes.holdersPage,
        },
      ],
    },

    governance: {
      name: 'governance-group',
      groupTranslationName: t('routers-groups.governance.name'),
      links: [
        {
          translationName: t('routers-groups.governance.routers.democracy'),
          route: vueRoutes.democracyPage,
        },
        {
          translationName: t('routers-groups.governance.routers.council'),
          route: vueRoutes.councilPage,
        },
        {
          translationName: t('routers-groups.governance.routers.treasury'),
          route: vueRoutes.treasuryPage,
        },
        {
          translationName: t('routers-groups.governance.routers.bounties'),
          route: vueRoutes.bountiesPage,
        },
        {
          translationName: t('routers-groups.governance.routers.tech-comm'),
          route: vueRoutes.techCommPage,
        },
      ],
    },

    evmExplorer: {
      name: 'evm-explorer',
      groupTranslationName: t('routers-groups.evm-explorer.name'),
      links: [
        {
          translationName: t('routers-groups.evm-explorer.routers.evm-explorer'),
          route: vueRoutes.evmExplorerPage,
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
