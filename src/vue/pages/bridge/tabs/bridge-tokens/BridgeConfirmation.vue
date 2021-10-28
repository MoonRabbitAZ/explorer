<template>
  <div class="bridge-confirmation">
    <h1 class="bridge-confirmation__amount bridge-confirmation__item">
      {{ $fbalance('10000') }}
    </h1>
    <bridge-info-block
      class="bridge-confirmation__chain-block bridge-confirmation__item"
      :header="$t('bridge-page.bridge-confirmation.from-header')"
      img-url="../static/branding/logo.png"
      value="ETH"
      secondary-value="Ethereum"
    />

    <bridge-info-block
      class="bridge-confirmation__chain-block bridge-confirmation__item"
      :header="$t('bridge-page.bridge-confirmation.to-header')"
      img-url="../static/branding/logo.png"
      value="ETH"
      secondary-value="Ethereum"
    />

    <bridge-info-block
      class="bridge-confirmation__chain-block bridge-confirmation__item"
      :header="$t('bridge-page.bridge-confirmation.asset-header')"
      img-url="../static/branding/logo.png"
      value="ETH"
      secondary-value="Ethereum"
    />
    <!-- eslint-disable max-len -->

    <bridge-info-block
      class="bridge-confirmation__chain-block bridge-confirmation__item"
      :header="$t('bridge-page.bridge-confirmation.destination-header')"
      img-url="../static/branding/logo.png"
      :value="'6a921700b007800c6a921700b007800c007800c007800c007800c007800cdfdjhj4hkjh3jsdhcjksdhc'"
    />

    <p class="bridge-confirmation__info-msg bridge-confirmation__item">
      {{ $t('bridge-page.bridge-confirmation.confirmation-info-msg') }}
    </p>

    <tick-field
      v-model="isAgreeTerms"
      class="bridge-confirmation__item"
      cb-value=""
      name="processing-personal-data-form-confirm-date"
    >
      <i18n-t
        class="bridge-confirmation__terms-of-use-lbl"
        keypath="bridge-page.bridge-confirmation.terms-of-use-lbl"
        tag="p"
      >
        <template #link>
          <a href="#">
            {{ $t('bridge-page.bridge-confirmation.terms-of-use-link') }}
          </a>
        </template>
      </i18n-t>
    </tick-field>

    <app-button
      class="bridge-confirmation__confirm-btn"
      scheme="primary"
      size="big"
      :text="$t('bridge-page.bridge-confirmation.confirm-btn')"
      :disabled="!isAgreeTerms"
    />
  </div>
</template>

<script>
import { TickField } from '@/vue/fields'
import BridgeInfoBlock from '@bridge-page/tabs/bridge-tokens/BridgeInfoBlock'

import { ref } from 'vue'

export default {
  name: 'bridge-confirmation',

  components: {
    BridgeInfoBlock,
    TickField,
  },

  setup () {
    const isAgreeTerms = ref(false)

    return {
      isAgreeTerms,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-confirmation {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0 $drawer-padding;
}

.bridge-confirmation__amount {
  text-align: center;
}

.bridge-confirmation__item {
  & + & {
    margin-top: 2rem;
  }
}

.bridge-confirmation__info-msg {
  color: $col-app-secondary;
}

.bridge-confirmation__confirm-btn {
  width: 100%;
  margin-top: auto;
}

.bridge-confirmation__terms-of-use-lbl {
  margin-left: 2rem;
}

</style>
