import AppContent from '@/AppContent'

import Explorer from '@explorer-page/Explorer'
import BlockInfoTab from '@explorer-page/tabs/BlockInfoTab'
import ChainInfoTab from '@explorer-page/tabs/ChainInfoTab'

import EventCalendar from '@event-calendar-page/EventCalendar'
import UpcomingEventsTab from '@event-calendar-page/tabs/UpcomingEventsTab'

import Wallet from '@wallet-page/Wallet'
import MyAccountsTab from '@wallet-page/tabs/MyAccountsTab'
import StakingTab from '@wallet-page/tabs/StakingTab'

import Holders from '@/vue/pages/Holders'

import ValidatorsMap from '@/vue/pages/validators-map/ValidatorsMap'

import Parachains from '@parachains-page/Parachains'
import ParachainsOverviewTab from '@parachains-page/tabs/ParachainsOverviewTab'
import ParathreadsTab from '@parachains-page/tabs/ParathreadsTab'
import AuctionsTab from '@parachains-page/tabs/AuctionsTab'
import CrowdloanTab from '@parachains-page/tabs/CrowdloanTab'

import Gilt from '@gilt-page/Gilt'
import GiltOverviewTab from '@gilt-page/tabs/GiltOverviewTab'

import Society from '@society-page/Society'
import SocietyOverviewTab from '@society-page/tabs/SocietyOverviewTab'
import CandidatesTab from '@society-page/tabs/CandidatesTab'
import SuspendedTab from '@society-page/tabs/SuspendedTab'

import Democracy from '@democracy-page/Democracy'
import DemocracyOverviewTab from '@democracy-page/tabs/DemocracyOverviewTab'
import DispatchTab from '@democracy-page/tabs/DispatchTab'

import Council from '@council-page/Council'
import CouncilOverviewTab from '@council-page/tabs/CouncilOverviewTab'
import MotionsTab from '@council-page/tabs/MotionsTab'

import Treasury from '@treasury-page/Treasury'
import TreasuryOverviewTab from '@treasury-page/tabs/TreasuryOverviewTab'
import TipsTab from '@treasury-page/tabs/TipsTab'

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
          {
            path: '/wallet/staking',
            name: vueRoutes.stakingTab.name,
            component: StakingTab,
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
      {
        path: '/parachains',
        name: vueRoutes.parachainsPage.name,
        component: Parachains,
        redirect: vueRoutes.parachainsOverviewTab,
        children: [
          {
            path: '/parachains/overview',
            name: vueRoutes.parachainsOverviewTab.name,
            component: ParachainsOverviewTab,
          },
          {
            path: '/parachains/parathreads',
            name: vueRoutes.parathreadsTab.name,
            component: ParathreadsTab,
          },
          {
            path: '/parachains/auctions',
            name: vueRoutes.auctionsTab.name,
            component: AuctionsTab,
          },
          {
            path: '/parachains/crowdloan',
            name: vueRoutes.crowdloanTab.name,
            component: CrowdloanTab,
          },
        ],
      },
      {
        path: '/gilt',
        name: vueRoutes.giltPage.name,
        component: Gilt,
        redirect: vueRoutes.giltOverviewTab,
        children: [
          {
            path: '/gilt/overview',
            name: vueRoutes.giltOverviewTab.name,
            component: GiltOverviewTab,
          },
        ],
      },
      {
        path: '/society',
        name: vueRoutes.societyPage.name,
        component: Society,
        redirect: vueRoutes.societyOverviewTab,
        children: [
          {
            path: '/society/overview',
            name: vueRoutes.societyOverviewTab.name,
            component: SocietyOverviewTab,
          },
          {
            path: '/society/candidates',
            name: vueRoutes.candidatesTab.name,
            component: CandidatesTab,
          },
          {
            path: '/society/suspended',
            name: vueRoutes.suspendedTab.name,
            component: SuspendedTab,
          },
        ],
      },
      {
        path: '/democracy',
        name: vueRoutes.democracyPage.name,
        component: Democracy,
        redirect: vueRoutes.democracyOverviewTab,
        children: [
          {
            path: '/democracy/overview',
            name: vueRoutes.democracyOverviewTab.name,
            component: DemocracyOverviewTab,
          },
          {
            path: '/democracy/dispatch',
            name: vueRoutes.dispatchTab.name,
            component: DispatchTab,
          },
        ],
      },
      {
        path: '/council',
        name: vueRoutes.councilPage.name,
        component: Council,
        redirect: vueRoutes.councilOverviewTab,
        children: [
          {
            path: '/council/overview',
            name: vueRoutes.councilOverviewTab.name,
            component: CouncilOverviewTab,
          },
          {
            path: '/council/motions',
            name: vueRoutes.motionsTab.name,
            component: MotionsTab,
          },
        ],
      },
      {
        path: '/treasury',
        name: vueRoutes.treasuryPage.name,
        component: Treasury,
        redirect: vueRoutes.treasuryOverviewTab,
        children: [
          {
            path: '/treasury/overview',
            name: vueRoutes.treasuryOverviewTab.name,
            component: TreasuryOverviewTab,
          },
          {
            path: '/treasury/tips',
            name: vueRoutes.tipsTab.name,
            component: TipsTab,
          },
        ],
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
