<template>
  <div class="bridge-tokens-tab">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('bridge-page.bridge-tokens-tab.error-header')"
          :message="$t('bridge-page.bridge-tokens-tab.error-message')"
        />
      </template>
      <template v-else-if="!isMetamaskConnected || !isMetamaskEnabled">
        <div class="bridge-tokens-tab__metamask-wrap">
          <metamask-form
            class="bridge-tokens-tab__metamask-form"
          />
        </div>
      </template>
      <template v-else-if="tokens.length && chains.length">
        <div class="bridge-tokens-tab__form-wrap">
          <bridge-tokens-form
            :tokens="tokens"
            :chains="chains"
          />
        </div>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import BridgeTokensForm from '@bridge-page/tabs/bridge-tokens/BridgeTokensForm'
import MetamaskForm from '@/vue/common/MetamaskForm'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, toRefs } from 'vue'
import { useWeb3 } from '@/vue/composables'
import { TokenRecord } from '@/js/records/token.record'
import { ChainRecord } from '@/js/records/chain.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { bridgeEthereumApi } from '@api'

export default {
  name: 'bridge-tokens-tab',

  components: { BridgeTokensForm, MetamaskForm, Loader, ErrorMessage },

  setup () {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      tokens: [],
      chains: [],
    })
    const {
      isMetamaskConnected,
      isMetamaskEnabled,
      initWeb3,
    } = useWeb3()

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        const [chains, tokens] = await Promise.all([
          bridgeEthereumApi.get('/bridge/chains'),
          bridgeEthereumApi.get('/bridge/tokens'),
          initWeb3(),
        ])

        state.chains = chains.data.map(i => (new ChainRecord(i)))
        state.tokens = tokens.data.map(i => (new TokenRecord(i)))
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    init()

    return {
      ...toRefs(state),
      isMetamaskEnabled,
      isMetamaskConnected,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-tokens-tab { @include app-padding; }

.bridge-tokens-tab__form-wrap {
  background: $col-app-content-block-bg;
  border-radius: 2rem;
  margin: 0 auto;
  padding: 2rem;
  max-width: 71rem;
}

.bridge-tokens-tab__metamask-wrap {
  background: $col-app-content-block-bg;
  border-radius: 2rem;
  width: 37.3rem;
  padding: 4rem 0;
  margin: 0 auto;
}

.bridge-tokens-tab__metamask-form {
  max-width: 27rem;
  margin: 0 auto;
}
</style>
