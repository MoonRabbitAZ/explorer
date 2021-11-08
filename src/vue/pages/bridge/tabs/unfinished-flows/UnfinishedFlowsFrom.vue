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
      @click="mintOrwithdrawErc20"
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
import { ERC20_ABI } from '@/js/const/erc20-abi.const'
import { ERC721_ABI } from '@/js/const/erc721-abi.const'
import { ETHEREUM_BRIDGE_ABI } from '@/js/const/ethereum-bridge-abi.const'
import { NATIVE_TOKEN_ABI } from '@/js/const/native-abi.const'

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
    const { web3, web3ChainId } = useWeb3()
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
      props.isWithdraw
        ? t('bridge-page.unfinished-flows-from.withdraw-btn')
        : t('bridge-page.unfinished-flows-from.deposit-btn'),
    )

    async function mintErc20 () {
      const contract = new web3.value.eth.Contract(
        ERC20_ABI,
        props.unfinishedFlow.token.internalContract,
      )
      await contract.methods.mint(
        state.parameters.details.amount,
        state.parameters.details.txHash,
        props.unfinishedFlow.flow.sender,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.unfinishedFlow.flow.sender })
    }

    async function mintErc721 () {
      const contract = new web3.value.eth.Contract(
        ERC721_ABI,
        props.unfinishedFlow.token.internalContract,
      )
      await contract.methods.mint(
        state.parameters.details.txHash,
        state.parameters.details.tokenUrl,
        state.parameters.details.tokenId,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.unfinishedFlow.flow.sender })
    }

    async function withdrawErc20 () {
      const contract = new web3.value.eth.Contract(
        ETHEREUM_BRIDGE_ABI,
        toChain.value.bridgeContract,
      )
      await contract.methods.withdrawERC20(
        props.unfinishedFlow.token.originalContract,
        state.parameters.details.txHash,
        state.parameters.details.amount,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.unfinishedFlow.flow.sender })
    }

    async function withdrawNativeToken () {
      const contract = new web3.value.eth.Contract(
        NATIVE_TOKEN_ABI,
        props.unfinishedFlow.token.internalContract,
      )

      await contract.methods.withdraw(
        state.parameters.details.txHash,
        state.parameters.details.amount,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.unfinishedFlow.flow.sender })
    }

    async function withdrawNative () {
      const contract = new web3.value.eth.Contract(
        ETHEREUM_BRIDGE_ABI,
        toChain.value.bridgeContract,
      )

      await contract.methods.withdrawNative(
        state.parameters.details.txHash,
        state.parameters.details.amount,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.web3Account })
    }

    async function withdrawErc721 () {
      const contract = new web3.value.eth.Contract(
        ERC721_ABI,
        props.unfinishedFlow.token.internalContract,
      )

      await contract.methods.withdraw(
        props.unfinishedFlow.token.originalContract,
        state.parameters.details.txHash,
        state.parameters.details.tokenId,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.unfinishedFlow.flow.sender })
    }

    async function mintOrwithdrawErc20 () {
      state.processing = true

      const query = {
        tx_hash: props.unfinishedFlow.flow.txHash,
        token_key: {
          ticker: props.unfinishedFlow.flow.ticker,
          chain_id: props.unfinishedFlow.flow.chainId,
        },
      }

      try {
        if (props.unfinishedFlow.flow.isTypeWithdraw) {
          const { data } = await bridgeEthereumApi.post('/bridge/withdraw', query)
          state.parameters = data

          if (props.unfinishedFlow.token.isOriginalTypeErc721) {
            await withdrawErc721()
          } else if (props.unfinishedFlow.token.isOriginalTypeNative) {
            await withdrawNative()
          } else {
            await withdrawErc20()
          }
        } else {
          const { data } = await bridgeEthereumApi.post('/bridge/deposit', query)
          state.parameters = data

          if (props.unfinishedFlow.token.isInternalTypeErc721) {
            await mintErc721()
          } else if (props.unfinishedFlow.token.isInternalTypeNative) {
            await withdrawNativeToken()
          } else {
            await mintErc20()
          }
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
      mintOrwithdrawErc20,
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
