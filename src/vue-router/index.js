
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
    component: () => import(/* webpackChunkName: "app-pages" */ '@/AppContent'),
    children: [
      {
        path: '/settings',
        name: vueRoutes.settingsPage.name,
        component: () => import(/* webpackChunkName: "app-pages" */ '@settings-page/Settings'),
        redirect: vueRoutes.settingsMetadataTab,
        children: [
          {
            path: '/settings/metadata',
            name: vueRoutes.settingsMetadataTab.name,
            component: () => import(/* webpackChunkName: "app-pages" */ '@settings-page/tabs/SettingsMetadataTab'),
          },
        ],
      },
      {
        path: '/rabbit-hole',
        name: vueRoutes.explorerPage.name,
        component: () => import(/* webpackChunkName: "rabbit-hole-page" */ '@explorer-page/Explorer'),
        redirect: vueRoutes.chainInfoTab,
        children: [
          {
            path: '/rabbit-hole/chain-info',
            name: vueRoutes.chainInfoTab.name,
            component: () => import(/* webpackChunkName: "rabbit-hole-page" */ '@explorer-page/tabs/ChainInfoTab'),
            props: true,
          },
          {
            path: '/rabbit-hole/block-info/:blockIdent?',
            name: vueRoutes.blockInfoTab.name,
            component: () => import(/* webpackChunkName: "rabbit-hole-page" */ '@explorer-page/tabs/BlockInfoTab'),
          },
        ],
      },
      {
        path: '/annals',
        name: vueRoutes.eventCalendarPage.name,
        component: () => import(/* webpackChunkName: "event-сalendar-page" */ '@event-calendar-page/EventCalendar'),
        redirect: vueRoutes.upcomingEventsTab,
        children: [
          {
            path: '/annals/upcoming-events',
            name: vueRoutes.upcomingEventsTab.name,
            component: () => import(/* webpackChunkName: "event-сalendar-page" */ '@event-calendar-page/tabs/UpcomingEventsTab'),
            props: true,
          },
        ],
      },
      {
        path: '/wallet',
        name: vueRoutes.walletPage.name,
        component: () => import(/* webpackChunkName: "wallet-page" */ '@wallet-page/Wallet'),
        redirect: vueRoutes.myAccountsTab,
        children: [
          {
            path: '/wallet/my-accounts',
            name: vueRoutes.myAccountsTab.name,
            component: () => import(/* webpackChunkName: "wallet-page" */ '@wallet-page/tabs/MyAccountsTab'),
          },
          {
            path: '/wallet/staking',
            name: vueRoutes.stakingTab.name,
            component: () => import(/* webpackChunkName: "wallet-page" */ '@wallet-page/tabs/StakingTab'),
          },
        ],
      },
      {
        path: '/holders',
        name: vueRoutes.holdersPage.name,
        component: () => import(/* webpackChunkName: "holders-page" */ '@/vue/pages/Holders'),
      },
      {
        path: '/map',
        name: vueRoutes.validatorsMapPage.name,
        component: () => import(/* webpackChunkName: "validators-map-page" */ '@/vue/pages/validators-map/ValidatorsMap'),
      },
      {
        path: '/parachains',
        name: vueRoutes.parachainsPage.name,
        component: () => import(/* webpackChunkName: "parachains-page" */ '@parachains-page/Parachains'),
        redirect: vueRoutes.parachainsOverviewTab,
        children: [
          {
            path: '/parachains/overview',
            name: vueRoutes.parachainsOverviewTab.name,
            component: () => import(/* webpackChunkName: "parachains-page" */ '@parachains-page/tabs/ParachainsOverviewTab'),
          },
          {
            path: '/parachains/parathreads',
            name: vueRoutes.parathreadsTab.name,
            component: () => import(/* webpackChunkName: "parachains-page" */ '@parachains-page/tabs/ParathreadsTab'),
          },
          {
            path: '/parachains/auctions',
            name: vueRoutes.auctionsTab.name,
            component: () => import(/* webpackChunkName: "parachains-page" */ '@parachains-page/tabs/AuctionsTab'),
          },
          {
            path: '/parachains/crowdloan',
            name: vueRoutes.crowdloanTab.name,
            component: () => import(/* webpackChunkName: "parachains-page" */ '@parachains-page/tabs/CrowdloanTab'),
          },
        ],
      },
      {
        path: '/gilt',
        name: vueRoutes.giltPage.name,
        component: () => import(/* webpackChunkName: "gilt-page" */ '@gilt-page/Gilt'),
        redirect: vueRoutes.giltOverviewTab,
        children: [
          {
            path: '/gilt/overview',
            name: vueRoutes.giltOverviewTab.name,
            component: () => import(/* webpackChunkName: "gilt-page" */ '@gilt-page/tabs/GiltOverviewTab'),
          },
        ],
      },
      {
        path: '/society',
        name: vueRoutes.societyPage.name,
        component: () => import(/* webpackChunkName: "society-page" */ '@society-page/Society'),
        redirect: vueRoutes.societyOverviewTab,
        children: [
          {
            path: '/society/overview',
            name: vueRoutes.societyOverviewTab.name,
            component: () => import(/* webpackChunkName: "society-page" */ '@society-page/tabs/SocietyOverviewTab'),
          },
          {
            path: '/society/candidates',
            name: vueRoutes.candidatesTab.name,
            component: () => import(/* webpackChunkName: "society-page" */ '@society-page/tabs/CandidatesTab'),
          },
          {
            path: '/society/suspended',
            name: vueRoutes.suspendedTab.name,
            component: () => import(/* webpackChunkName: "society-page" */ '@society-page/tabs/SuspendedTab'),
          },
        ],
      },
      {
        path: '/democracy',
        name: vueRoutes.democracyPage.name,
        component: () => import(/* webpackChunkName: "democracy-page" */ '@democracy-page/Democracy'),
        redirect: vueRoutes.democracyOverviewTab,
        children: [
          {
            path: '/democracy/overview',
            name: vueRoutes.democracyOverviewTab.name,
            component: () => import(/* webpackChunkName: "democracy-page" */ '@democracy-page/tabs/DemocracyOverviewTab'),
          },
          {
            path: '/democracy/dispatch',
            name: vueRoutes.dispatchTab.name,
            component: () => import(/* webpackChunkName: "democracy-page" */ '@democracy-page/tabs/DispatchTab'),
          },
        ],
      },
      {
        path: '/council',
        name: vueRoutes.councilPage.name,
        component: () => import(/* webpackChunkName: "council-page" */ '@council-page/Council'),
        redirect: vueRoutes.councilOverviewTab,
        children: [
          {
            path: '/council/overview',
            name: vueRoutes.councilOverviewTab.name,
            component: () => import(/* webpackChunkName: "council-page" */ '@council-page/tabs/CouncilOverviewTab'),
          },
          {
            path: '/council/motions',
            name: vueRoutes.motionsTab.name,
            component: () => import(/* webpackChunkName: "council-page" */ '@council-page/tabs/MotionsTab'),
          },
        ],
      },
      {
        path: '/treasury',
        name: vueRoutes.treasuryPage.name,
        component: () => import(/* webpackChunkName: "treasury-page" */ '@treasury-page/Treasury'),
        redirect: vueRoutes.treasuryOverviewTab,
        children: [
          {
            path: '/treasury/overview',
            name: vueRoutes.treasuryOverviewTab.name,
            component: () => import(/* webpackChunkName: "treasury-page" */ '@treasury-page/tabs/TreasuryOverviewTab'),
          },
          {
            path: '/treasury/tips',
            name: vueRoutes.tipsTab.name,
            component: () => import(/* webpackChunkName: "treasury-page" */ '@treasury-page/tabs/TipsTab'),
          },
        ],
      },
      {
        path: '/bounties',
        name: vueRoutes.bountiesPage.name,
        component: () => import(/* webpackChunkName: "bounties-page" */ '@bounties-page/Bounties'),
        redirect: vueRoutes.bountiesOverviewTab,
        children: [
          {
            path: '/bounties/overview',
            name: vueRoutes.bountiesOverviewTab.name,
            component: () => import(/* webpackChunkName: "bounties-page" */ '@bounties-page/tabs/BountiesOverviewTab'),
          },
        ],
      },
      {
        path: '/tech-comm',
        name: vueRoutes.techCommPage.name,
        component: () => import(/* webpackChunkName: "tech-comm-page" */ '@tech-comm-page/TechComm'),
        redirect: vueRoutes.techCommOverviewTab,
        children: [
          {
            path: '/tech-comm/overview',
            name: vueRoutes.techCommOverviewTab.name,
            component: () => import(/* webpackChunkName: "tech-comm-page" */ '@tech-comm-page/tabs/TechCommOverviewTab'),
          },
          {
            path: '/tech-comm/proposals',
            name: vueRoutes.proposalsTab.name,
            component: () => import(/* webpackChunkName: "tech-comm-page" */ '@tech-comm-page/tabs/ProposalsTab'),
          },
        ],
      },
      {
        path: '/bridge',
        name: vueRoutes.bridgePage.name,
        component: () => import(/* webpackChunkName: "bridge-page" */ '@bridge-page/Bridge'),
        redirect: vueRoutes.bridgeTokensTab,
        children: [
          {
            path: '/bridge/tokens',
            name: vueRoutes.bridgeTokensTab.name,
            component: () => import(/* webpackChunkName: "bridge-page" */ '@bridge-page/tabs/BridgeTokensTab'),
          },
          {
            path: '/bridge/nft',
            name: vueRoutes.bridgeNFTTab.name,
            component: () => import(/* webpackChunkName: "bridge-page" */ '@bridge-page/tabs/BridgeTokensTab'),
            props: { isErc721: true },
          },
          {
            path: '/bridge/unfinished-flows',
            name: vueRoutes.unfinishedFlowsTab.name,
            component: () => import(/* webpackChunkName: "bridge-page" */ '@bridge-page/tabs/UnfinishedFlowsTab'),
          },
        ],
      },
      {
        path: '/evm-explorer',
        name: vueRoutes.evmExplorerPage.name,
        component: () => import(/* webpackChunkName: "evm-explorer" */ '@evm-explorer-page/EvmExplorer'),
        redirect: vueRoutes.evmExplorerOverviewTab,
        children: [
          {
            path: '/evm-explorer/overview',
            name: vueRoutes.evmExplorerOverviewTab.name,
            component: () => import(/* webpackChunkName: "evm-explorer" */ '@evm-explorer-page/tabs/EvmExplorerOverviewTab'),
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
