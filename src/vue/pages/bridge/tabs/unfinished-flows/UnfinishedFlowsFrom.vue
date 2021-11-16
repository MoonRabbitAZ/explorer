<template>
  <div class="unfinished-flows-from">
    <div class="unfinished-flows-from__chain-status">
      <icon
        class="unfinished-flows-from__chain-status-icon"
        :class="{
          'unfinished-flows-from__chain-status-icon--success': isToChainActive
        }"
        :name="chainStatusIconName"
      />
      <p class="unfinished-flows-from__chain-status-msg">
        {{ chainStatusMsg }}
      </p>
    </div>

    <app-button
      class="unfinished-flows-from__mint-btn"
      scheme="primary"
      size="big"
      :text="buttonTranslation"
      :disabled="isButtonDisabled"
      @click="depositOrWithdrawWithWeb3"
    />
  </div>
</template>

<script>
import Icon from '@/vue/common/Icon'

import { reactive, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeb3 } from '@/vue/composables'
import { bridgeEthereumApi } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'unfinished-flows-from',

  components: {
    Icon,
  },

  props: {
    unfinishedFlow: { type: Object, required: true },
    baseChain: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { t } = useI18n()
    const {
      web3ChainId,
      mintErc20,
      mintErc721,
      withdrawErc20,
      withdrawNative,
      withdrawErc721,
    } = useWeb3()
    const state = reactive({
      parameters: null,
      processing: false,
    })

    const toChain = computed(() =>
      props.unfinishedFlow.flow.isTypeWithdraw
        ? props.unfinishedFlow.chain
        : props.baseChain,
    )

    const isToChainActive = computed(() =>
      +web3ChainId.value === toChain.value.id,
    )
    const chainStatusIconName = computed(() =>
      isToChainActive.value ? 'success' : 'alert',
    )

    const chainStatusMsg = computed(() =>
      isToChainActive.value
        ? t('bridge-page.unfinished-flows-from.confirm-chain-status-msg', {
          network: toChain.value.name,
        })
        : t('bridge-page.unfinished-flows-from.alert-chain-status-msg', {
          network: toChain.value.name,
        }),
    )

    const isButtonDisabled = computed(() =>
      state.processing || !isToChainActive.value,
    )

    const buttonTranslation = computed(() =>
      props.unfinishedFlow.flow.isTypeWithdraw
        ? t('bridge-page.unfinished-flows-from.withdraw-btn')
        : t('bridge-page.unfinished-flows-from.deposit-btn'),
    )

    async function depositOrWithdraw () {
      const query = {
        tx_hash: props.unfinishedFlow.flow.txHash,
        token_key: {
          ticker: props.unfinishedFlow.flow.ticker,
          chain_id: props.unfinishedFlow.flow.chainId,
        },
      }

      const endpoint = props.unfinishedFlow.flow.isTypeWithdraw
        ? '/bridge/withdraw'
        : '/bridge/deposit'

      const { data } = await bridgeEthereumApi.post(endpoint, query)
      state.parameters = data
    }

    async function withdraw () {
      const withdrawParams = {
        txHash: state.parameters.details.txHash,
        signatureR: [state.parameters.signature.r],
        signatureS: [state.parameters.signature.s],
        signatureV: [state.parameters.signature.v],
      }

      if (props.unfinishedFlow.token.isOriginalTypeErc721) {
        await withdrawErc721({
          ...withdrawParams,
          contractAddress: toChain.value.bridgeContract,
          address: props.unfinishedFlow.token.originalContract,
          tokenId: state.parameters.details.tokenId,
        })
      } else if (props.unfinishedFlow.token.isOriginalTypeNative) {
        await withdrawNative({
          ...withdrawParams,
          contractAddress: toChain.value.bridgeContract,
          amount: state.parameters.details.amount,
        })
      } else {
        await withdrawErc20({
          ...withdrawParams,
          contractAddress: toChain.value.bridgeContract,
          address: props.unfinishedFlow.token.originalContract,
          amount: state.parameters.details.amount,
        })
      }
    }

    async function deposit () {
      const depositParams = {
        contractAddress: props.unfinishedFlow.token.internalContract,
        txHash: state.parameters.details.txHash,
        signatureR: [state.parameters.signature.r],
        signatureS: [state.parameters.signature.s],
        signatureV: [state.parameters.signature.v],
      }

      if (props.unfinishedFlow.token.isInternalTypeErc721) {
        await mintErc721({
          ...depositParams,
          tokenUrl: state.parameters.details.tokenUrl,
          tokenId: state.parameters.details.tokenId,
        })
      } else if (props.unfinishedFlow.token.isInternalTypeErc20) {
        await mintErc20({
          ...depositParams,
          amount: state.parameters.details.amount,
          receiverAddress: props.unfinishedFlow.flow.sender,
        })
      }
    }

    async function depositOrWithdrawWithWeb3 () {
      state.processing = true
      try {
        await depositOrWithdraw()
        if (props.unfinishedFlow.flow.isTypeWithdraw) {
          await withdraw()
        } else {
          await deposit()
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
      isButtonDisabled,
      buttonTranslation,
      depositOrWithdrawWithWeb3,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.unfinished-flows-from {
  height: 100%;
  padding: 0 $drawer-padding;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.unfinished-flows-from__chain-status {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unfinished-flows-from__chain-status-icon {
  width: 5.5rem;
  height: 5.5rem;
  color: $col-app-error;

  &--success {
    color: $col-app-accent;
  }
}

.unfinished-flows-from__chain-status-msg {
  margin-top: 3.5rem;
  font-size: 1.4rem;
  max-width: 25rem;
  text-align: center;
}

.unfinished-flows-from__mint-btn {
  margin-top: auto;
}
</style>
