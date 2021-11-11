<template>
  <div class="unfinished-flows-tab">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('bridge-page.unfinished-flows-tab.error-header')"
          :message="$t('bridge-page.unfinished-flows-tab.error-message')"
        />
      </template>
      <template v-else>
        <unfinished-flows-list
          :unfinished-flows="unfinishedFlows"
          :base-chain="baseChain"
          @updateFlowList="init"
        />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import UnfinishedFlowsList from '@bridge-page/tabs/unfinished-flows/UnfinishedFlowsList'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, toRefs, watch } from 'vue'
import { useWeb3 } from '@/vue/composables'
import { bridgeEthereumApi } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TokenRecord } from '@/js/records/token.record'
import { ChainRecord } from '@/js/records/chain.record'
import { UnfinishedFlowRecord } from '@/js/records/unfinished-flow.record'

export default {
  name: 'unfinished-flows-tab',

  components: {
    UnfinishedFlowsList,
    Loader,
    ErrorMessage,
  },

  setup () {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      unfinishedFlows: [],
      baseChain: {},
    })
    const { web3Account } = useWeb3()

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        const [flows, chains, tokens] = await Promise.all([
          bridgeEthereumApi.get('/oracle/flows', {
            page: {
              limit: 100,
            },
            filter: {
              sender: web3Account.value,
            },
          }),
          bridgeEthereumApi.get('/bridge/chains', {
            page: {
              limit: 100,
            },
          }),
          bridgeEthereumApi.get('/bridge/tokens'),
        ])

        const chainsRecords = chains.data.map(i => (new ChainRecord(i)))
        const tokensRecords = tokens.data.map(i => (new TokenRecord(i)))
        const flowRecords = flows.data.map(i => (new UnfinishedFlowRecord(i)))
        const collectedFlows = flowRecords.map(async (flow) => {
          const chain = chainsRecords.find(curChain =>
            curChain.id === flow.chainId,
          )
          const token = tokensRecords.find(curToken =>
            curToken.chainId === flow.chainId &&
              curToken.ticker === flow.ticker,
          )

          return {
            chain,
            token,
            flow,
            decimals: +token.nativeChainDecimals,
          }
        })

        state.unfinishedFlows = await Promise.all(collectedFlows)
        state.baseChain = chainsRecords.find(i => i.isBase)
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    watch(web3Account, init, { immediate: true })

    return {
      ...toRefs(state),
      init,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.unfinished-flows-tab { @include app-padding; }
</style>
