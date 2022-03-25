<template>
  <div class="bridge-tokens-tab">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('bridge-page.bridge-tokens-tab.error-header')"
          :message="$t('bridge-page.bridge-tokens-tab.error-message')"
        />
      </template>
      <template v-else>
        <template v-if="tokens.length && chains.length">
          <div class="bridge-tokens-tab__form-wrap">
            <bridge-tokens-form
              :tokens="tokens"
              :chains="chains"
              :is-erc721="isErc721"
            />
          </div>
        </template>
        <template v-else>
          <no-data-message
            class="bridge-tokens-tab__no-data-message"
            :message="$t('bridge-page.bridge-tokens-tab.no-data-message')"
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
import BridgeTokensForm from '@bridge-page/tabs/bridge-tokens/BridgeTokensForm'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs, watch } from 'vue'
import { TokenRecord } from '@/js/records/token.record'
import { ChainRecord } from '@/js/records/chain.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { bridgeEthereumApi } from '@api'
import { TOKEN_TYPES } from '@/js/const/token.const'

export default {
  name: 'bridge-tokens-tab',

  components: {
    BridgeTokensForm,
    Loader,
    ErrorMessage,
    NoDataMessage,
  },

  props: {
    isErc721: { type: Boolean, default: false },
  },

  setup (props) {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      tokens: [],
      chains: [],
    })

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
          bridgeEthereumApi.get('/bridge/tokens', {
            filter: {
              token_type: props.isErc721
                ? `${TOKEN_TYPES.erc721},${TOKEN_TYPES.erc1155}`
                : `${TOKEN_TYPES.native},${TOKEN_TYPES.erc20}`,
            },
          }),
        ])
        state.chains = chains.data.map(i => (new ChainRecord(i)))
        state.tokens = tokens.data.map(i => (new TokenRecord(i)))
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    watch(() => props.isErc721, init, { immediate: true })

    return {
      ...toRefs(state),
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

.bridge-tokens-tab__no-data-message {
  background: $col-app-content-block-bg;
  margin: 0 auto;
  max-width: max-content;
}
</style>
