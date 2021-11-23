<template>
  <div class="bridge-tokens-form">
    <div class="bridge-tokens-form__body">
      <div class="bridge-tokens-form__current-token-wrap">
        <select-field
          v-model="form.currentToken.value"
          class="bridge-tokens-form__select-token"
          :label="$t('bridge-page.bridge-tokens-form.asset-lbl')"
          :options="tokens"
          :can-deselect="false"
          value-prop="ticker"
          option-label="ticker"
          track-by="ticker"
          object
          searchable
          clear-on-search
          @blur="form.currentToken.blur"
          @open="displaySelectValue = false"
          @close="displaySelectValue = true"
        >
          <template
            v-if="displaySelectValue"
            v-slot:singlelabel="{ value }"
          >
            <div class="bridge-tokens-form__token-value">
              <h2>
                {{ value.ticker }}
              </h2>
              <p class="bridge-tokens-form__token-chain">
                {{ value.originalChainName }}
              </p>
            </div>
          </template>

          <template v-slot:option="{ option }">
            <div>
              <h2>
                {{ option.ticker }}
              </h2>
              <p>
                {{ option.originalChainName }}
              </p>
            </div>
          </template>
        </select-field>
      </div>
      <div class="bridge-tokens-form__chains">
        <bridge-info-block
          class="bridge-tokens-form__chain-block"
          :header="$t('bridge-page.bridge-tokens-form.from-header')"
          :value="currentToken.ticker"
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
          :value="currentToken.ticker"
          :secondary-value="toChain.name"
        />
      </div>

      <template v-if="isErc721">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-model="form.tokenId.value"
              @blur="form.tokenId.blur"
              name="bridge-tokens-tokenId"
              :error-message="form.tokenId.errorMessage"
              :label="$t('bridge-page.bridge-tokens-form.token-id-lbl')"
              :placeholder="
                $t('bridge-page.bridge-tokens-form.token-id-placeholder')
              "
            />
          </div>
        </div>
      </template>

      <template v-if="isLoaded">
        <template v-if="isDisplayForm">
          <template v-if="!isErc721">
            <div class="app__form-row">
              <div class="app__form-field">
                <amount-field
                  v-model="form.amount.value"
                  @blur="form.amount.blur"
                  name="bridge-tokens-amount"
                  :error-message="form.amount.errorMessage"
                  :label="$t('bridge-page.bridge-tokens-form.amount-lbl', {
                    balance: currentFormatedBalance,
                  })"
                  :decimals="currentTokenDecimals"
                  :disabled="isFormDisabled || !+currentBalance"
                />
              </div>
            </div>
          </template>

          <template
            v-if="isErc721 && (erc721Token?.name || erc721Token?.imageUrl)"
          >
            <bridge-info-block
              class="bridge-tokens-form__token-name-block"
              :header="
                $t('bridge-page.bridge-tokens-form.token-name-header')
              "
              :value="erc721Token.name"
            />
            <div
              v-if="erc721Token.imageUrl"
              class="bridge-tokens-form__token-img-wrap"
            >
              <img
                class="bridge-tokens-form__token-img"
                :src="erc721Token.imageUrl"
                alt="token image"
              >
            </div>
          </template>

          <bridge-info-block
            class="bridge-tokens-form__destination-block"
            :header="$t('bridge-page.bridge-tokens-form.destination-header')"
            :value="web3Account"
          />
          <p class="bridge-tokens-form__destination-info">
            {{ $t('bridge-page.bridge-tokens-form.destination-info') }}
          </p>

          <app-button
            class="bridge-tokens-form__next-btn"
            scheme="primary"
            :text="$t('bridge-page.bridge-tokens-form.next-btn')"
            @click="toConfirm"
          />
        </template>
        <template v-else>
          <template v-if="isFromChainActive">
            <error-message
              class="bridge-tokens-form__error"
              :message="errorMessage"
            />
          </template>
          <template v-else>
            <error-message
              class="bridge-tokens-form__error"
            >
              <i18n-t
                class="bridge-tokens-form__error-chain-msg"
                keypath="bridge-page.bridge-tokens-form.chain-error-part-1"
                tag="p"
              >
                <template #network>
                  <span class="bridge-tokens-form__error-chain-msg">
                    {{ fromChain.name }}
                  </span>
                </template>
                <template #link>
                  <a
                    class="bridge-tokens-form__error-chain-link"
                    :href="CONFIG.LIBRARY_APP_LINK"
                    target="_blank"
                    rel="noopener"
                  >
                    <!-- eslint-disable-next-line max-len -->
                    {{ $t('bridge-page.bridge-tokens-form.chain-error-link-part-1') }}
                  </a>
                </template>
              </i18n-t>
              <p class="bridge-tokens-form__error-chain-msg">
                {{ $t('bridge-page.bridge-tokens-form.chain-error-part-2') }}
              </p>
              <p class="bridge-tokens-form__error-chain-msg">
                {{ $t('bridge-page.bridge-tokens-form.chain-error-part-3') }}
              </p>
            </error-message>
          </template>
        </template>
      </template>
      <template v-else>
        <loader />
      </template>
      <i18n-t
        class="bridge-tokens-form__mainnet-transfer-msg"
        keypath="bridge-page.bridge-tokens-form.mainnet-transfer-msg"
        tag="p"
      >
        <template #link>
          <a
            :href="CONFIG.LIBRARY_APP_LINK"
            target="_blank"
            rel="noopener"
          >
            {{ $t('bridge-page.bridge-tokens-form.mainnet-transfer-link') }}
          </a>
        </template>
      </i18n-t>
    </div>

    <drawer
      v-model:is-shown="isFormConfirmationOpen"
      :close-by-click-outside="false"
      is-default-body
    >
      <template #heading>
        {{ $t('bridge-page.bridge-tokens-form.drawer-confirmation-header') }}
      </template>
      <bridge-confirmation
        :current-token="currentToken"
        :to-chain="toChain"
        :from-chain="fromChain"
        :amount="form?.amount?.value"
        :web3-account="web3Account"
        :current-token-decimals="currentTokenDecimals"
        :is-withdraw="isWithdraw"
        :is-from-chain-active="isFromChainActive"
        :erc721-token="erc721Token"
        :is-erc721="isErc721"
        @close-drawer="isFormConfirmationOpen = false"
      />
    </drawer>
  </div>
</template>

<script>
import { SelectField, AmountField, InputField } from '@/vue/fields'
import Drawer from '@/vue/common/Drawer'
import BridgeInfoBlock from '@bridge-page/tabs/bridge-tokens/BridgeInfoBlock'
import BridgeConfirmation from '@bridge-page/tabs/bridge-tokens/BridgeConfirmation'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'

import { reactive, toRefs, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiCaller } from '@api'
import { useForm, useValidators, useWeb3, useFormatBalance } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { ERC721_ABI } from '@/js/const/erc721-abi.const'
import { ERC20_ABI } from '@/js/const/erc20-abi.const'
import { Erc721TokenRecord } from '@/js/records/erc721-token.record'
import CONFIG from '@/config'
import debounce from 'lodash/debounce'

const MIN_TRANSFER_AMOUNT = 1
const DEBOUNCE_DELAY = 500 // ms

export default {
  name: 'bridge-tokens-form',

  components: {
    SelectField,
    Drawer,
    BridgeInfoBlock,
    AmountField,
    InputField,
    BridgeConfirmation,
    ErrorMessage,
    Loader,
  },

  props: {
    chains: {
      type: Array, /** {@link ChainRecord} **/
      required: true,
    },
    tokens: {
      type: Array, /** {@link TokenRecord} **/
      required: true,
    },
    isErc721: { type: Boolean, required: false },
  },

  setup (props) {
    const { t } = useI18n()
    const { web3Account, web3, web3ChainId } = useWeb3()
    const { toExternalBalance } = useFormatBalance()

    const state = reactive({
      baseChain: props.chains.find(i => i.isBase),
      isWithdraw: false,
      isFormConfirmationOpen: false,
      currentBalance: '',
      currentTokenDecimals: 0,
      isLoaded: false,
      isLoadFailed: false,
      erc721Token: null,
      displaySelectValue: true,
    })

    const { required, amountRange } = useValidators()
    const formController = useForm({
      currentToken: {
        value: props.tokens[0],
      },
      ...(props.isErc721
        ? {
            tokenId: {
              value: '',
            },
          }
        : {
            amount: {
              value: '0',
              validators: computed(() => ({
                required,
                ...(+state.currentBalance
                  ? {
                      amountRange: amountRange(
                        MIN_TRANSFER_AMOUNT,
                        state.currentBalance,
                        state.currentTokenDecimals,
                        currentToken.value.ticker,
                      ),
                    }
                  : {}
                ),
              })),
            },
          }
      ),
    })

    const fromChain = computed(() =>
      state.isWithdraw
        ? state.baseChain
        : props.chains.find(i =>
          i.id === formController.form.currentToken.value.chainId),
    )

    const toChain = computed(() =>
      state.isWithdraw
        ? props.chains.find(i =>
          i.id === formController.form.currentToken.value.chainId)
        : state.baseChain,
    )

    const currentToken = computed(() =>
      props.tokens.find(i =>
        i.ticker === formController.form.currentToken.value.ticker &&
          i.chainId === formController.form.currentToken.value.chainId,
      ),
    )

    const currentFormatedBalance = computed(() =>
      toExternalBalance(
        state.currentBalance,
        state.currentTokenDecimals,
        currentToken.value.ticker,
      ),
    )

    const isFromChainActive = computed(() =>
      +web3ChainId.value === fromChain.value.id,
    )

    const isDisplayForm = computed(() => {
      const isHaveToken = Boolean(props.isErc721
        ? state.erc721Token
        : +state.currentBalance,
      )
      if (state.isFormConfirmationOpen) {
        return true
      } else {
        return !state.isLoadFailed && isFromChainActive.value && isHaveToken
      }
    })

    const errorMessage = computed(() => {
      if (props.isErc721 && !state.erc721Token) {
        return t('bridge-page.bridge-tokens-form.nft-error-message')
      } else if (!props.isErc721 && !+state.currentBalance) {
        return t('bridge-page.bridge-tokens-form.balance-error-message')
      } else {
        return t('bridge-page.bridge-tokens-form.default-error-message')
      }
    })

    function toConfirm () {
      if (formController.isFormValid()) {
        state.isFormConfirmationOpen = true
      }
    }

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        if (isFromChainActive.value && !state.isFormConfirmationOpen) {
          if (props.isErc721) {
            await initErc721()
          } else {
            await initErc20()
          }
        }
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    async function initErc20 () {
      const contractAddress = state.isWithdraw
        ? currentToken.value.internalContract
        : currentToken.value.originalContract

      if (state.isWithdraw && currentToken.value.isInternalTypeNative) {
        const balance = await web3.value.eth.getBalance(web3Account.value)
        state.currentBalance = balance
        state.currentTokenDecimals = +currentToken.value.nativeChainDecimals
      } else if (currentToken.value.isOriginalTypeNative) {
        const balance = await web3.value.eth.getBalance(web3Account.value)
        state.currentBalance = balance
        state.currentTokenDecimals = +currentToken.value.nativeChainDecimals
      } else {
        const contract =
              new web3.value.eth.Contract(ERC20_ABI, contractAddress)
        const [balance, decimals] = await Promise.all([
          contract.methods.balanceOf(web3Account.value).call(),
          contract.methods.decimals().call(),
        ])
        state.currentBalance = balance
        state.currentTokenDecimals = +decimals
      }
    }

    async function initErc721 () {
      state.erc721Token = null
      if (!formController.form.tokenId.value) return
      const contractAddress = state.isWithdraw
        ? currentToken.value.internalContract
        : currentToken.value.originalContract

      const contract = new web3.value.eth.Contract(
        ERC721_ABI,
        contractAddress,
      )

      const tokenOwner = await contract.methods
        .ownerOf(formController.form.tokenId.value)
        .call()

      if (tokenOwner !== web3Account.value) return

      const tokentUri = await contract.methods
        .tokenURI(formController.form.tokenId.value)
        .call()

      const tokenDetails = await getTokenDetailsByURI(tokentUri)
      state.erc721Token = new Erc721TokenRecord({
        ...tokenDetails,
        tokentUri,
        id: formController.form.tokenId.value,
      })
    }

    async function getTokenDetailsByURI (tokentUri) {
      try {
        const { data } = apiCaller.withBaseURL(tokentUri).getRaw('')
        return data
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    }

    watch(
      [currentToken, web3Account, toChain, web3ChainId],
      init,
      { immediate: true },
    )
    watch(() => state.isFormConfirmationOpen, init)
    if (props.isErc721) {
      const initWithDebounce = debounce(init, DEBOUNCE_DELAY)
      watch(() => formController.form.tokenId.value, initWithDebounce)
    }

    return {
      ...toRefs(state),
      ...formController,
      fromChain,
      toChain,
      web3Account,
      currentToken,
      currentFormatedBalance,
      isFromChainActive,
      toConfirm,
      isDisplayForm,
      errorMessage,
      CONFIG,
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

.bridge-tokens-form__token-value {
  width: 100%;
}

.bridge-tokens-form__token-chain {
  color: $col-app-secondary;
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

.bridge-tokens-form__token-name-block,
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

.bridge-tokens-form__token-img-wrap {
  max-width: max-content;
  margin: 2rem auto 0;
}

.bridge-tokens-form__token-img {
  object-fit: contain;
  max-width: 100%;
  max-height: 15.4rem;
  border-radius: 1.2rem;
  overflow: hidden;
}

.bridge-tokens-form__error {
  margin: 4rem 0;
}

.bridge-tokens-form__error-chain-msg {
  font-size: inherit;
  color: inherit;

  & + & {
    margin-top: 1rem;
  }
}

.bridge-tokens-form__error-chain-link {
  font-size: inherit;
  color: inherit;
  text-decoration: underline;
}

.bridge-tokens-form__mainnet-transfer-msg {
  text-align: center;
  margin-top: 2rem;
}
</style>
