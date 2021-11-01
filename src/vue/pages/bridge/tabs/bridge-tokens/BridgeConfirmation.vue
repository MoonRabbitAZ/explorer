<template>
  <div class="bridge-confirmation">
    <bridge-confirmation-transfer-step
      v-if="currentStep === STEPS.transfer"
      :current-token="currentToken"
      :to-chain="toChain"
      :from-chain="fromChain"
      :amount="amount"
      :web3-account="web3Account"
      :is-processing="processing"
      :current-token-decimals="currentTokenDecimals"
      :is-withdraw="isWithdraw"
      @confirm="depositOrWithdraw"
    />

    <div
      v-if="currentStep === STEPS.mintOrwithdrawErc20"
      class="bridge-confirmation__mint-body"
    >
      <div class="bridge-confirmation__chain-status">
        <icon
          class="bridge-confirmation__chain-status-icon"
          :class="{
            'bridge-confirmation__chain-status-icon--success': isFromChainActive
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
        @click="mintOrwithdrawErc20"
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
import { erc20ABI } from '@/js/const/erc20-abi.const'
import { ethereumBridgeABI } from '@/js/const/ethereum-bridge-abi.const'
import { ChainRecord } from '@/js/records/chain.record'
import { TokenRecord } from '@/js/records/token.record'

const STEPS = {
  transfer: 1,
  mintOrwithdrawErc20: 2,
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
    amount: { type: String, required: true },
    web3Account: { type: String, required: true },
    currentTokenDecimals: { type: Number, required: true },
    isWithdraw: { type: Boolean, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const { web3, web3ChainId } = useWeb3()
    const state = reactive({
      parameters: null,
      currentStep: STEPS.transfer,
      processing: false,
    })

    const isFromChainActive = computed(() =>
      +web3ChainId.value === props.toChain.id,
    )

    const chainStatusIconName = computed(() =>
      isFromChainActive.value ? 'success' : 'alert',
    )

    const chainStatusMsg = computed(() =>
      isFromChainActive.value
        ? t('bridge-page.bridge-confirmation.confirm-chain-status-msg', {
          network: props.toChain.name,
        })
        : t('bridge-page.bridge-confirmation.alert-chain-status-msg', {
          network: props.toChain.name,
        }),
    )

    const isButtonDisabled = computed(() =>
      state.processing || !isFromChainActive.value,
    )

    const buttonTranslation = computed(() =>
      props.isWithdraw
        ? t('bridge-page.bridge-confirmation.withdraw-btn')
        : t('bridge-page.bridge-confirmation.deposit-btn'),
    )

    async function withdraw () {
      try {
        const contract = new web3.value.eth.Contract(
          erc20ABI,
          props.currentToken.internalContract,
        )

        const { transactionHash } =
          await contract.methods.burn(props.amount)
            .send({ from: props.web3Account })

        const query = {
          tx_hash: transactionHash,
          token_key: {
            ticker: props.currentToken.tokenTicker,
            chain_id: props.currentToken.chainId,
          },
        }

        const { data } = await bridgeEthereumApi.post('/bridge/withdraw', query)
        state.parameters = data
        state.currentStep = STEPS.mintOrwithdrawErc20
      } catch (e) {
        ErrorHandler.process(e)
      }
    }

    async function deposit () {
      const contract = new web3.value.eth.Contract(
        erc20ABI,
        props.currentToken.originalContract,
      )

      const test = await contract.methods.transfer(
        props.fromChain.bridgeContract,
        props.amount,
      ).send({ from: props.web3Account })

      const query = {
        tx_hash: test.transactionHash,
        token_key: {
          ticker: props.currentToken.tokenTicker,
          chain_id: props.currentToken.chainId,
        },
      }
      const { data } = await bridgeEthereumApi.post('/bridge/deposit', query)
      state.parameters = data
      state.currentStep = STEPS.mintOrwithdrawErc20
    }

    async function mint () {
      const contract = new web3.value.eth.Contract(
        erc20ABI,
        props.currentToken.internalContract,
      )
      await contract.methods.mint(
        state.parameters.details.amount,
        state.parameters.details.txHash,
        props.web3Account,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.web3Account })
    }

    async function withdrawErc20 () {
      const contract = new web3.value.eth.Contract(
        ethereumBridgeABI,
        props.toChain.bridgeContract,
      )
      await contract.methods.withdrawERC20(
        props.currentToken.originalContract,
        state.parameters.details.txHash,
        state.parameters.details.amount,
        [state.parameters.signature.r],
        [state.parameters.signature.s],
        [state.parameters.signature.v],
      ).send({ from: props.web3Account })
    }

    async function depositOrWithdraw () {
      state.processing = true
      try {
        if (props.isWithdraw) {
          await withdraw()
        } else {
          await deposit()
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      state.processing = false
    }

    async function mintOrwithdrawErc20 () {
      state.processing = true
      try {
        if (props.isWithdraw) {
          await withdrawErc20()
        } else {
          await mint()
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      state.processing = false
    }

    return {
      ...toRefs(state),
      chainStatusMsg,
      chainStatusIconName,
      isFromChainActive,
      STEPS,
      depositOrWithdraw,
      mintOrwithdrawErc20,
      isButtonDisabled,
      buttonTranslation,
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
