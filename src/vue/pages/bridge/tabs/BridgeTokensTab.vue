<template>
  <div class="bridge-tokens-tab">
    <div
      v-if="!isMetamaskConnected || !isMetamaskEnabled"
      class="bridge-tokens-tab__metamask-wrap"
    >
      <metamask-form
        class="bridge-tokens-tab__metamask-form"
      />
    </div>
    <div
      v-else
      class="bridge-tokens-tab__form-wrap"
    >
      <bridge-tokens-form />
    </div>
  </div>
</template>

<script>
import BridgeTokensForm from '@bridge-page/tabs/bridge-tokens/BridgeTokensForm'
import MetamaskForm from '@/vue/common/MetamaskForm'

import { useWeb3 } from '@/vue/composables'

export default {
  name: 'bridge-tokens-tab',

  components: { BridgeTokensForm, MetamaskForm },

  setup () {
    const {
      web3Account,
      isMetamaskConnected,
      isMetamaskEnabled,
      initWeb3,
    } = useWeb3()

    initWeb3()

    return {
      isMetamaskEnabled,
      web3Account,
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
