import AppContent from '@/AppContent'

import Explorer from '@explorer-page/Explorer'
import BlockInfoTab from '@explorer-page/tabs/BlockInfoTab'
import ChainInfoTab from '@explorer-page/tabs/ChainInfoTab'

import EventCalendar from '@event-calendar-page/EventCalendar'
import UpcomingEventsTab from '@event-calendar-page/tabs/UpcomingEventsTab'

import Wallet from '@wallet-page/Wallet'
import MyAccountsTab from '@wallet-page/tabs/MyAccountsTab'

import Holders from '@/vue/pages/Holders'

import ValidatorsMap from '@/vue/pages/validators-map/ValidatorsMap'

import { createRouter, createWebHistory } from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'

const routes = [
  {
    path: '/:catchAll(.*)',
    redirect: vueRoutes.app,
  },
  {
    path: '/',
    name: vueRoutes.app.name,
    redirect: vueRoutes.explorerPage,
    component: AppContent,
    children: [
      {
        path: '/rabbit-hole',
        name: vueRoutes.explorerPage.name,
        component: Explorer,
        redirect: vueRoutes.chainInfoTab,
        children: [
          {
            path: '/rabbit-hole/chain-info',
            name: vueRoutes.chainInfoTab.name,
            component: ChainInfoTab,
            props: true,
          },
          {
            path: '/rabbit-hole/block-info/:blockIdent?',
            name: vueRoutes.blockInfoTab.name,
            component: BlockInfoTab,
          },
        ],
      },
      {
        path: '/annals',
        name: vueRoutes.eventCalendarPage.name,
        component: EventCalendar,
        redirect: vueRoutes.upcomingEventsTab,
        children: [
          {
            path: '/annals/upcoming-events',
            name: vueRoutes.upcomingEventsTab.name,
            component: UpcomingEventsTab,
            props: true,
          },
        ],
      },
      {
        path: '/wallet',
        name: vueRoutes.walletPage.name,
        component: Wallet,
        redirect: vueRoutes.myAccountsTab,
        children: [
          {
            path: '/wallet/my-accounts',
            name: vueRoutes.myAccountsTab.name,
            component: MyAccountsTab,
          },
        ],
      },
      {
        path: '/holders',
        name: vueRoutes.holdersPage.name,
        component: Holders,
      },
      {
        path: '/map',
        name: vueRoutes.validatorsMapPage.name,
        component: ValidatorsMap,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior: _ => ({ x: 0, y: 0 }),
})

export default router
export { vueRoutes }
