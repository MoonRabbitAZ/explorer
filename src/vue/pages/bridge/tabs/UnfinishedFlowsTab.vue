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
        <template v-if="chains.length && tokens.length">
          <unfinished-flows-list
            :key="web3Account"
            :base-chain="baseChain"
            :chains="chains"
            :tokens="tokens"
          />
        </template>
        <template v-else>
          <no-data-message
            class="unfinished-flows-tab__no-data-message"
            :message="$t('bridge-page.unfinished-flows-tab.no-data-message')"
          />
        </template>
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
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs } from 'vue'
import { bridgeEthereumApi } from '@api'
import { useWeb3 } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TokenRecord } from '@/js/records/token.record'
import { ChainRecord } from '@/js/records/chain.record'

export default {
  name: 'unfinished-flows-tab',

  components: {
    UnfinishedFlowsList,
    Loader,
    ErrorMessage,
    NoDataMessage,
  },

  setup () {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      baseChain: {},
      chains: [],
      tokens: [],
    })
    const { web3Account } = useWeb3()

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        const [chains, tokens] = await Promise.all([
          bridgeEthereumApi.get('/bridge/chains', {
            page: {
              limit: 100,
            },
          }),
          bridgeEthereumApi.get('/bridge/tokens'),
        ])

        state.chains = chains.data.map(i => (new ChainRecord(i)))
        state.tokens = tokens.data.map(i => (new TokenRecord(i)))
        state.baseChain = state.chains.find(i => i.isBase)
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    init()

    return {
      ...toRefs(state),
      web3Account,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.unfinished-flows-tab { @include app-padding; }

.unfinished-flows-tab__no-data-message {
  background: $col-app-content-block-bg;
  margin: 0 auto;
  max-width: max-content;
}
</style>
