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
  })

  return {
    ...toRefs(tabs),
  }
}
