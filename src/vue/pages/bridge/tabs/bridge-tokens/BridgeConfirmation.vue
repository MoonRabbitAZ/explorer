<template>
  <div class="bridge-confirmation">
    <bridge-confirmation-transfer-step
      v-if="currentStep === STEPS.depositOrWithdrawFirstStep"
      :current-token="currentToken"
      :to-chain="toChain"
      :from-chain="fromChain"
      :amount="amount"
      :web3-account="web3Account"
      :is-processing="processing"
      :current-token-decimals="currentTokenDecimals"
      :is-withdraw="isWithdraw"
      :is-from-chain-active="isFromChainActive"
      :is-erc721="isErc721"
      :erc721-token="erc721Token"
      @confirm="depositOrWithdrawFirstStep"
    />

    <div
      v-if="currentStep === STEPS.depositOrWithdrawSecondStep"
      class="bridge-confirmation__mint-body"
    >
      <div class="bridge-confirmation__chain-status">
        <icon
          class="bridge-confirmation__chain-status-icon"
          :class="{
            'bridge-confirmation__chain-status-icon--success': isToChainActive
          }"
          :name="chainStatusIconName"
        />
        <p class="bridge-confirmation__chain-status-msg">
          {{ chainStatusMsg }}
        </p>
      </div>

      <app-button
        class="bridge-confirmation__mint-btn"
        scheme="primary"
        size="big"
        :text="buttonTranslation"
        :disabled="isButtonDisabled"
        @click="depositOrWithdrawSecondStep"
      />
    </div>
  </div>
</template>

<script>
import BridgeConfirmationTransferStep from '@bridge-page/tabs/bridge-tokens/BridgeConfirmationTransferStep'
import Icon from '@/vue/common/Icon'

import { reactive, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { bridgeEthereumApi } from '@api'
import { useWeb3 } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { ChainRecord } from '@/js/records/chain.record'
import { TokenRecord } from '@/js/records/token.record'
import { Erc721TokenRecord } from '@/js/records/erc721-token.record'

const STEPS = {
  depositOrWithdrawFirstStep: 1,
  depositOrWithdrawSecondStep: 2,
}

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'bridge-confirmation',

  components: {
    BridgeConfirmationTransferStep,
    Icon,
  },

  props: {
    fromChain: { type: ChainRecord, required: true },
    toChain: { type: ChainRecord, required: true },
    currentToken: { type: TokenRecord, required: true },
    amount: { type: String, default: '' },
    currentTokenDecimals: { type: Number, default: 0 },
    web3Account: { type: String, required: true },
    isWithdraw: { type: Boolean, required: true },
    isFromChainActive: { type: Boolean, required: true },
    isErc721: { type: Boolean, required: true },
    erc721Token: {
      type: Erc721TokenRecord,
      default: () => (new Erc721TokenRecord()),
    },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { t } = useI18n()
    const {
      web3ChainId,
      transferErc721,
      transferNative,
      burnErc20,
      transferErc20,
      mintErc20,
      mintErc721,
      withdrawErc20,
      withdrawNative,
      withdrawErc721,
    } = useWeb3()
    const state = reactive({
      parameters: null,
      txHash: '',
      currentStep: STEPS.depositOrWithdrawFirstStep,
      processing: false,
    })

    const isToChainActive = computed(() =>
      +web3ChainId.value === props.toChain.id,
    )
    const chainStatusIconName = computed(() =>
      isToChainActive.value ? 'success' : 'alert',
    )

    const chainStatusMsg = computed(() =>
      isToChainActive.value
        ? t('bridge-page.bridge-confirmation.confirm-chain-status-msg', {
          network: props.toChain.name,
        })
        : t('bridge-page.bridge-confirmation.alert-chain-status-msg', {
          network: props.toChain.name,
        }),
    )

    const isButtonDisabled = computed(() =>
      state.processing || !isToChainActive.value,
    )

    const buttonTranslation = computed(() =>
      props.isWithdraw
        ? t('bridge-page.bridge-confirmation.withdraw-btn')
        : t('bridge-page.bridge-confirmation.deposit-btn'),
    )

    async function depositFirstStep () {
      if (props.currentToken.isOriginalTypeErc721) {
        const { transactionHash } = await transferErc721({
          contractAddress: props.currentToken.originalContract,
          fromAddress: props.web3Account,
          toAddress: props.fromChain.bridgeContract,
          tokenId: props.erc721Token.id,
        })

        state.txHash = transactionHash
      } else if (props.currentToken.isOriginalTypeNative) {
        const { transactionHash } = await transferNative({
          fromAddress: props.web3Account,
          toAddress: props.fromChain.bridgeContract,
          value: props.amount,
        })
        state.txHash = transactionHash
      } else {
        const { transactionHash } = await transferErc20({
          contractAddress: props.currentToken.originalContract,
          recipientAddress: props.fromChain.bridgeContract,
          amount: props.amount,
        })
        state.txHash = transactionHash
      }

      const query = {
        tx_hash: state.txHash,
        token_key: {
          ticker: props.currentToken.ticker,
          chain_id: props.currentToken.chainId,
        },
      }

      const { data } = await bridgeEthereumApi.post('/bridge/deposit', query)
      state.parameters = data

      if (props.currentToken.isInternalTypeNative) {
        Bus.success('bridge-page.bridge-confirmation.native-token-info-msg')
        emit(EVENTS.closeDrawer)
      }
    }

    async function withdrawFirstStep () {
      if (props.currentToken.isInternalTypeErc721) {
        const { transactionHash } = await transferErc721({
          contractAddress: props.currentToken.internalContract,
          fromAddress: props.web3Account,
          toAddress: props.currentToken.internalContract,
          tokenId: props.erc721Token.id,
        })

        state.txHash = transactionHash
      } else if (props.currentToken.isInternalTypeNative) {
        const { transactionHash } = await transferNative({
          fromAddress: props.web3Account,
          toAddress: props.currentToken.internalContract,
          value: props.amount,
        })

        state.txHash = transactionHash
      } else {
        const { transactionHash } = await burnErc20(
          props.amount,
          props.currentToken.internalContract,
        )
        state.txHash = transactionHash
      }

      const query = {
        tx_hash: state.txHash,
        token_key: {
          ticker: props.currentToken.ticker,
          chain_id: props.currentToken.chainId,
        },
      }

      const { data } = await bridgeEthereumApi.post('/bridge/withdraw', query)
      state.parameters = data
    }

    async function withdrawSecondStep () {
      const withdrawParams = {
        txHash: state.parameters.details.txHash,
        signatureR: [state.parameters.signature.r],
        signatureS: [state.parameters.signature.s],
        signatureV: [state.parameters.signature.v],
      }

      if (props.currentToken.isOriginalTypeErc721) {
        await withdrawErc721({
          ...withdrawParams,
          contractAddress: props.toChain.bridgeContract,
          address: props.currentToken.originalContract,
          tokenId: state.parameters.details.tokenId,
        })
      } else if (props.currentToken.isOriginalTypeNative) {
        await withdrawNative({
          ...withdrawParams,
          contractAddress: props.toChain.bridgeContract,
          amount: state.parameters.details.amount,
        })
      } else {
        await withdrawErc20({
          ...withdrawParams,
          contractAddress: props.toChain.bridgeContract,
          address: props.currentToken.originalContract,
          amount: state.parameters.details.amount,
        })
      }
    }

    async function depositSecondStep () {
      const depositParams = {
        contractAddress: props.currentToken.internalContract,
        txHash: state.parameters.details.txHash,
        signatureR: [state.parameters.signature.r],
        signatureS: [state.parameters.signature.s],
        signatureV: [state.parameters.signature.v],
      }

      if (props.currentToken.isInternalTypeErc721) {
        await mintErc721({
          ...depositParams,
          tokenUrl: state.parameters.details.tokenUrl,
          tokenId: state.parameters.details.tokenId,
        })
      } else {
        await mintErc20({
          ...depositParams,
          amount: state.parameters.details.amount,
          receiverAddress: props.web3Account,
        })
      }
    }

    async function depositOrWithdrawFirstStep () {
      state.processing = true
      try {
        if (props.isWithdraw) {
          await withdrawFirstStep()
        } else {
          await depositFirstStep()
        }

        state.currentStep = STEPS.depositOrWithdrawSecondStep
      } catch (e) {
        ErrorHandler.process(e)
      }
      state.processing = false
    }

    async function depositOrWithdrawSecondStep () {
      state.processing = true
      try {
        if (props.isWithdraw) {
          await withdrawSecondStep()
        } else {
          await depositSecondStep()
        }

        Bus.success()
        emit(EVENTS.closeDrawer)
      } catch (e) {
        ErrorHandler.process(e)
      }
      state.processing = false
    }

    return {
      ...toRefs(state),
      chainStatusMsg,
      chainStatusIconName,
      isToChainActive,
      depositOrWithdrawFirstStep,
      depositOrWithdrawSecondStep,
      isButtonDisabled,
      buttonTranslation,
      STEPS,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-confirmation {
  height: 100%;
  padding: 0 $drawer-padding;
}

.bridge-confirmation__mint-body {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.bridge-confirmation__chain-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bridge-confirmation__chain-status-icon {
  width: 5.5rem;
  height: 5.5rem;
  color: $col-app-error;

  &--success {
    color: $col-app-accent;
  }
}

.bridge-confirmation__chain-status-msg {
  margin-top: 3.5rem;
  font-size: 1.4rem;
  max-width: 25rem;
  text-align: center;
}

.bridge-confirmation__mint-btn {
  margin-top: auto;
}
</style>
