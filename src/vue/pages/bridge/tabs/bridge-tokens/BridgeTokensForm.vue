<template>
  <div class="bridge-tokens-form">
    <div class="bridge-tokens-form__body">
      <div class="bridge-tokens-form__current-token-wrap">
        <select-field
          v-model="form.currentTokenKey.value"
          :label="$t('bridge-page.bridge-tokens-form.asset-lbl')"
          :options="tokens"
          :can-deselect="false"
          option-label="tokenTicker"
          value-prop="tokenKey"
          track-by="tokenTicker"
          @blur="form.currentTokenKey.blur"
          searchable
          clear-on-search
        >
          <template v-slot:option="{ option }">
            {{ option.tokenTicker }}
          </template>
        </select-field>
      </div>
      <div class="bridge-tokens-form__chains">
        <bridge-info-block
          class="bridge-tokens-form__chain-block"
          :header="$t('bridge-page.bridge-tokens-form.from-header')"
          img-url="../static/branding/logo.png"
          :value="currentToken.tokenTicker"
          :secondary-value="fromChain.name"
        />

        <app-button
          class="bridge-tokens-form__switch-btn"
          size="small"
          scheme="primary"
          mdi-icon-name="mdi-autorenew"
          @click="isWithdraw = !isWithdraw"
        />

        <bridge-info-block
          class="bridge-tokens-form__chain-block"
          :header="$t('bridge-page.bridge-tokens-form.to-header')"
          img-url="../static/branding/logo.png"
          :value="currentToken.tokenTicker"
          :secondary-value="toChain.name"
        />
      </div>

      <template v-if="isLoaded">
        <template v-if="isNecessaryChain">
          <div class="app__form-row">
            <div class="app__form-field">
              <amount-field
                v-model="form.amount.value"
                @blur="form.amount.blur"
                name="staking-form-founds-step-amount"
                :error-message="form.amount.errorMessage"
                :label="$t('bridge-page.bridge-tokens-form.amount-lbl', {
                  balance: currentFormatedBalance,
                })"
                :decimals="currentTokenDecimals"
                :disabled="isFormDisabled"
              />
            </div>
          </div>
          <!-- eslint-disable max-len -->
          <bridge-info-block
            class="bridge-tokens-form__destination-block"
            :header="$t('bridge-page.bridge-tokens-form.destination-header')"
            img-url="../static/branding/logo.png"
            :value="web3Account"
          />
          <p class="bridge-tokens-form__destination-info">
            {{ $t('bridge-page.bridge-tokens-form.destination-info') }}
          </p>

          <app-button
            class="bridge-tokens-form__next-btn"
            scheme="primary"
            :text="$t('bridge-page.bridge-tokens-form.next-btn')"
            @click="goConfirm"
          />
        </template>
        <template v-else>
          <error-message
            class="bridge-tokens-form__chain-error"
            :message="$t('bridge-page.bridge-tokens-form.error-chain-message', {
              network: toChain.name
            })"
          />
        </template>
      </template>
      <template v-else>
        <loader />
      </template>

      <i18n-t
        class="bridge-tokens-form__mainet-transfer-msg"
        keypath="bridge-page.bridge-tokens-form.mainet-transfer-msg"
        tag="p"
      >
        <template #link>
          <a
            :href="MAINET_TRANSFER_INFO_LINK"
            target="_blank"
            rel="noopener"
          >
            {{ $t('bridge-page.bridge-tokens-form.mainet-transfer-link') }}
          </a>
        </template>
      </i18n-t>
    </div>

    <drawer
      v-model:is-shown="isFormConfirmationOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('bridge-page.bridge-tokens-form.drawer-confirmation-header') }}
      </template>
      <bridge-confirmation
        :current-token="currentToken"
        :to-chain="toChain"
        :from-chain="fromChain"
        :amount="form.amount.value"
        :web3-account="web3Account"
        :current-token-decimals="currentTokenDecimals"
        :is-withdraw="isWithdraw"
      />
    </drawer>
  </div>
</template>

<script>
import { SelectField, AmountField } from '@/vue/fields'
import Drawer from '@/vue/common/Drawer'
import BridgeInfoBlock from '@bridge-page/tabs/bridge-tokens/BridgeInfoBlock'
import BridgeConfirmation from '@bridge-page/tabs/bridge-tokens/BridgeConfirmation'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'

import { reactive, toRefs, computed, watch } from 'vue'
import { useForm, useValidators, useWeb3, useFormatBalance } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { erc20ABI } from '@/js/const/erc20-abi.const'

const MAINET_TRANSFER_INFO_LINK = 'https://lib.moonrabbit.com/'

const MIN_TRANSFER_AMOUNT = 1

export default {
  name: 'bridge-tokens-form',

  components: {
    SelectField,
    Drawer,
    BridgeInfoBlock,
    AmountField,
    BridgeConfirmation,
    ErrorMessage,
    Loader,
  },

  props: {
    chains: { type: Array, required: true },
    tokens: { type: Array, required: true },
  },

  setup (props) {
    const { web3Account, web3, web3ChainId } = useWeb3()
    const { toBalance } = useFormatBalance()

    const state = reactive({
      baseChain: props.chains.find(i => i.isBase),
      isWithdraw: false,
      isFormConfirmationOpen: false,
      currentBalance: '',
      currentTokenDecimals: '',
      isLoaded: false,
    })

    const { required, amountRange } = useValidators()
    const formController = useForm({
      currentTokenKey: {
        value: props.tokens[0].tokenKey,
      },
      amount: {
        value: '0',
        validators: computed(() => ({
          required,
          ...(+state.currentBalance
            ? {
                amountRange: amountRange(
                  MIN_TRANSFER_AMOUNT,
                  state.currentBalance,
                ),
              }
            : {}
          ),
        })),
      },
    })

    const fromChain = computed(() =>
      state.isWithdraw
        ? state.baseChain
        : props.chains.find(i =>
          i.id === formController.form.currentTokenKey.value.chainId),
    )

    const toChain = computed(() =>
      state.isWithdraw
        ? props.chains.find(i =>
          i.id === formController.form.currentTokenKey.value.chainId)
        : state.baseChain,
    )

    const currentToken = computed(() =>
      props.tokens.find(i =>
        i.tokenTicker === formController.form.currentTokenKey.value.ticker &&
          i.chainId === formController.form.currentTokenKey.value.chainId,
      ),
    )

    const currentFormatedBalance = computed(() => {
      const options = {
        withSi: true,
        withSiFull: false,
        withUnit: currentToken.value.tokenTicker,
      }
      return toBalance(
        state.currentBalance,
        state.currentTokenDecimals,
        options,
      )
    })

    const isNecessaryChain = computed(() =>
      +web3ChainId.value === fromChain.value.id,
    )

    function goConfirm () {
      if (formController.isFormValid()) {
        state.isFormConfirmationOpen = true
      }
    }

    async function init () {
      state.isLoaded = false
      try {
        if (isNecessaryChain.value) {
          const contractAddress = state.isWithdraw
            ? currentToken.value.internalContract
            : currentToken.value.originalContract
          const contract =
            new web3.value.eth.Contract(erc20ABI, contractAddress)
          const [balance, decimals] = await Promise.all([
            contract.methods.balanceOf(web3Account.value).call(),
            contract.methods.decimals().call(),
          ])
          state.currentBalance = balance
          state.currentTokenDecimals = +decimals
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      state.isLoaded = true
    }

    watch(
      [currentToken, web3Account, toChain, web3ChainId],
      init,
      { immediate: true },
    )

    return {
      ...toRefs(state),
      ...formController,
      MAINET_TRANSFER_INFO_LINK,
      fromChain,
      toChain,
      web3Account,
      currentToken,
      currentFormatedBalance,
      isNecessaryChain,
      goConfirm,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-tokens-form__chains {
  display: grid;
  grid-template-columns: 1fr 3.6rem 1fr;
  grid-gap: 2rem 3.2rem;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2rem;

  @include respond-to($small) {
    grid-template-columns: 3.6rem 1fr;
    grid-gap: 2rem;
    align-items: center;
  }
}

.bridge-tokens-form__chain-block {
  flex: 1;
}

.bridge-tokens-form__switch-btn {
  margin-bottom: 1.55rem;

  @include respond-to($small) {
    grid-row: 1/3;
    grid-column: 1/2;
  }
}

.bridge-tokens-form__destination-block {
  margin-top: 2rem;
}

.bridge-tokens-form__destination-info {
  margin-top: 0.4rem;
  color: $col-app-secondary;
}

.bridge-tokens-form__next-btn {
  min-width: 12.3rem;
  margin-top: 2rem;

  @include respond-to($x-small) {
    width: 100%;
  }
}

.bridge-tokens-form__chain-error {
  margin: 4rem 0;
}

.bridge-tokens-form__mainet-transfer-msg {
  text-align: center;
  margin-top: 2rem;
}
</style>
