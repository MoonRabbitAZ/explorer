import { reactive } from 'vue'
import { vueRoutes } from '@/vue-router'
import { useI18n } from 'vue-i18n'
import CONFIG from '@/config'

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
          translationName: t('page-tabs.wallet.staking'),
          route: vueRoutes.stakingTab,
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
    links: {
      name: 'links',
      groupTranslationName: t('routers-groups.links.name'),
      links: [
        {
          translationName: t('routers-groups.links.routers.smart-contracts-explorer'),
          link: CONFIG.EVM_EXPLORER_LINK,
        },
        {
          translationName: t('routers-groups.links.routers.tutorials'),
          link: CONFIG.LIBRARY_APP_LINK,
        },
        {
          translationName: t('routers-groups.links.routers.nft'),
          link: CONFIG.NFT_MARKETPLACE_LINK,
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
