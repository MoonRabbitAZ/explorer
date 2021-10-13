import { reactive, toRefs } from 'vue'
import { vueRoutes } from '@/vue-router'
import { useI18n } from 'vue-i18n'

export function usePagesTabs () {
  const { t } = useI18n()

  const tabs = reactive({
    explorer: [
      {
        translationName: t('page-tabs.explorer.chain-info'),
        route: vueRoutes.chainInfoTab,
      },
      {
        translationName: t('page-tabs.explorer.block-info'),
        route: vueRoutes.blockInfoTab,
      },
    ],

    calendarEvents: [
      {
        translationName: t('page-tabs.event-calendar.upcoming-events'),
        route: vueRoutes.upcomingEventsTab,
      },
    ],

    wallet: [
      {
        translationName: t('page-tabs.wallet.my-accounts'),
        route: vueRoutes.myAccountsTab,
      },
      {
        translationName: t('page-tabs.wallet.staking'),
        route: vueRoutes.stakingTab,
      },
    ],

    parachains: [
      {
        translationName: t('page-tabs.parachains.overview'),
        route: vueRoutes.parachainsOverviewTab,
      },
      {
        translationName: t('page-tabs.parachains.parathreads'),
        route: vueRoutes.parathreadsTab,
      },
      {
        translationName: t('page-tabs.parachains.auctions'),
        route: vueRoutes.auctionsTab,
      },
      {
        translationName: t('page-tabs.parachains.crowdloan'),
        route: vueRoutes.crowdloanTab,
      },
    ],

    gilt: [
      {
        translationName: t('page-tabs.gilt.overview'),
        route: vueRoutes.giltOverviewTab,
      },
    ],

    society: [
      {
        translationName: t('page-tabs.society.overview'),
        route: vueRoutes.societyOverviewTab,
      },
      {
        translationName: t('page-tabs.society.candidates'),
        route: vueRoutes.candidatesTab,
      },
      {
        translationName: t('page-tabs.society.suspended'),
        route: vueRoutes.suspendedTab,
      },
    ],

    democracy: [
      {
        translationName: t('page-tabs.democracy.overview'),
        route: vueRoutes.democracyOverviewTab,
      },
      {
        translationName: t('page-tabs.democracy.dispatch'),
        route: vueRoutes.dispatchTab,
      },
    ],

    council: [
      {
        translationName: t('page-tabs.council.overview'),
        route: vueRoutes.councilOverviewTab,
      },
      {
        translationName: t('page-tabs.council.motions'),
        route: vueRoutes.motionsTab,
      },
    ],

    treasury: [
      {
        translationName: t('page-tabs.treasury.overview'),
        route: vueRoutes.treasuryOverviewTab,
      },
      {
        translationName: t('page-tabs.treasury.tips'),
        route: vueRoutes.tipsTab,
      },
    ],

    bounties: [
      {
        translationName: t('page-tabs.bounties.overview'),
        route: vueRoutes.bountiesOverviewTab,
      },
    ],
  })

  return {
    ...toRefs(tabs),
  }
}
