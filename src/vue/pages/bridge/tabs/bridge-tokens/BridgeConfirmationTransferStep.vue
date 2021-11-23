<template>
  <div class="bridge-confirmation-transfer-step">
    <div class="bridge-confirmation-transfer-step__confirmation-body">
      <template v-if="isFromChainActive">
        <h1
          v-tooltip="isErc721 ? '' : currentFullAmount"
          class="
            bridge-confirmation-transfer-step__amount
            bridge-confirmation-transfer-step__item
          "
        >
          <template v-if="isErc721">
            {{ erc721Token?.name }}
          </template>
          <template v-else>
            {{ currentFormatedAmount }}
          </template>
        </h1>

        <!-- eslint-disable -->
        <template v-if="isErc721 && erc721Token?.imageUrl">
          <div class="bridge-confirmation-transfer-step__token-img-wrap">
            <img
              class="bridge-confirmation-transfer-step__token-img"
              :src="erc721Token.imageUrl"
              alt="token image"
            >
          </div>
        </template>

        <bridge-info-block
          class="
          bridge-confirmation-transfer-step__chain-block
          bridge-confirmation-transfer-step__item
        "
          :header="
            $t('bridge-page.bridge-confirmation-transfer-step.from-header')
          "
          :value="currentToken.ticker"
          :secondary-value="fromChain.name"
        />

        <!-- eslint-disable max-len -->
        <bridge-info-block
          class="
          bridge-confirmation-transfer-step__chain-block
          bridge-confirmation-transfer-step__item
        "
          :header="$t('bridge-page.bridge-confirmation-transfer-step.to-header')"
          :value="currentToken.ticker"
          :secondary-value="toChain.name"
        />

        <bridge-info-block
          class="
          bridge-confirmation-transfer-step__chain-block
          bridge-confirmation-transfer-step__item
        "
          :header="
            $t('bridge-page.bridge-confirmation-transfer-step.asset-header')
          "
          :value="currentToken.ticker"
          :secondary-value="currentToken.originalChainName"
        />

        <bridge-info-block
          class="
          bridge-confirmation-transfer-step__chain-block
          bridge-confirmation-transfer-step__item
        "
          :header="$t('bridge-page.bridge-confirmation-transfer-step.destination-header')"
          :value="web3Account"
        />

        <p
          class="
          bridge-confirmation-transfer-step__info-msg
          bridge-confirmation-transfer-step__item
        "
        >
          {{ $t('bridge-page.bridge-confirmation-transfer-step.confirmation-info-msg') }}
        </p>

        <tick-field
          v-model="isAgreeTerms"
          class="bridge-confirmation-transfer-step__item"
          cb-value=""
          name="processing-personal-data-form-confirm-date"
          :disabled="isProcessing"
        >
          <i18n-t
            class="bridge-confirmation-transfer-step__terms-of-use-lbl"
            keypath="bridge-page.bridge-confirmation-transfer-step.terms-of-use-lbl"
            tag="p"
          >
            <template #link>
              <a 
                :href="CONFIG.TERMS_OF_USE_LINK"
                target="_blank"
                rel="noopener"
              >
                {{ $t('bridge-page.bridge-confirmation-transfer-step.terms-of-use-link') }}
              </a>
            </template>
          </i18n-t>
        </tick-field>
      </template>
      <template v-else>
        <error-message
          :message="$t('bridge-page.bridge-confirmation-transfer-step.chain-error-message', {
            network: fromChain.name
          })"
        />
      </template>
      <!-- eslint-enable max-len -->
    </div>

    <app-button
      class="bridge-confirmation-transfer-step__confirm-btn"
      scheme="primary"
      size="big"
      :text="$t('bridge-page.bridge-confirmation-transfer-step.confirm-btn')"
      :disabled="isDepositBtnDisabled"
      @click="onConfirm"
    />
  </div>
</template>

<script>
import { TickField } from '@/vue/fields'
import BridgeInfoBlock from '@bridge-page/tabs/bridge-tokens/BridgeInfoBlock'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { ref, computed } from 'vue'
import { useFormatBalance } from '@/vue/composables'
import { ChainRecord } from '@/js/records/chain.record'
import { TokenRecord } from '@/js/records/token.record'
import { Erc721TokenRecord } from '@/js/records/erc721-token.record'
import CONFIG from '@/config'

const EVENTS = {
  confirm: 'confirm',
}

export default {
  name: 'bridge-confirmation-transfer-step',

  components: {
    BridgeInfoBlock,
    TickField,
    ErrorMessage,
  },

  props: {
    fromChain: { type: ChainRecord, required: true },
    toChain: { type: ChainRecord, required: true },
    currentToken: { type: TokenRecord, required: true },
    web3Account: { type: String, required: true },
    isProcessing: { type: Boolean, required: true },
    currentTokenDecimals: { type: Number, default: 0 },
    isWithdraw: { type: Boolean, required: true },
    isFromChainActive: { type: Boolean, required: true },
    isErc721: { type: Boolean, required: true },
    amount: { type: String, default: '' },
    erc721Token: {
      type: Erc721TokenRecord,
      default: () => (new Erc721TokenRecord()),
    },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { toExternalBalance, toFullBalance } = useFormatBalance()
    const isAgreeTerms = ref(false)

    const isDepositBtnDisabled = computed(() =>
      props.isProcessing || !isAgreeTerms.value || !props.isFromChainActive,
    )

    const currentFormatedAmount = computed(() =>
      toExternalBalance(
        props.amount,
        props.currentTokenDecimals,
        props.currentToken.ticker,
      ),
    )

    const currentFullAmount = computed(() =>
      toFullBalance(
        props.amount,
        props.currentTokenDecimals,
        props.currentToken.ticker,
      ),
    )

    function onConfirm () { emit(EVENTS.confirm) }

    return {
      isAgreeTerms,
      onConfirm,
      isDepositBtnDisabled,
      currentFormatedAmount,
      currentFullAmount,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-confirmation-transfer-step {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.bridge-confirmation-transfer-step__confirmation-body {
  margin-bottom: 3rem;
}

.bridge-confirmation-transfer-step__amount {
  text-align: center;
}

.bridge-confirmation-transfer-step__token-img-wrap {
  max-width: max-content;
  margin: 2rem auto;
}

.bridge-confirmation-transfer-step__token-img {
  object-fit: contain;
  max-width: 100%;
  max-height: 15.4rem;
  border-radius: 1.2rem;
  overflow: hidden;
}

.bridge-confirmation-transfer-step__item {
  & + & {
    margin-top: 2rem;
  }
}

.bridge-confirmation-transfer-step__info-msg {
  color: $col-app-secondary;
}

.bridge-confirmation-transfer-step__confirm-btn {
  width: 100%;
  margin-top: auto;
}

.bridge-confirmation-transfer-step__terms-of-use-lbl {
  margin-left: 2rem;
}

</style>
