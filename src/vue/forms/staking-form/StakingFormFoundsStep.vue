<template>
  <div class="staking-form-founds-step">
    <form
      novalidate
      @submit.prevent="isFormValid() && nextStep()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.senderAddress.value"
            :options="accounts"
            :label="$t('select-field-current-account-lbl')"
            :can-deselect="false"
            option-label="name"
            value-prop="address"
            :error-message="form.senderAddress.errorMessage"
            @blur="form.senderAddress.blur"
          />
        </div>
      </div>

      <template v-if="senderBalances">
        <div class="staking-form-founds-step__body">
          <h3 class="staking-form-founds-step__title">
            {{ $t('balance-title') }}
          </h3>
          <p class="staking-form-founds-step__balance-value">
            {{ $fbalance(senderBalances.availableBalance) }}
          </p>
          <h3 class="staking-form-founds-step__title">
            {{ $t('deposit-title') }}
          </h3>
          <p class="staking-form-founds-step__deposit-value">
            {{ $fbalance(existentialDeposit) }}
          </p>

          <template v-if="!senderBalances.availableBalance.isZero()">
            <div class="app__form-row staking-transfer-form__select-wrap">
              <div class="app__form-field">
                <select-field
                  v-model="form.stakingTypeId.value"
                  :options="stakingTypes"
                  :label="$t('select-field-staking-type-lbl')"
                  :can-deselect="false"
                  option-label="name"
                  value-prop="id"
                  :error-message="form.stakingTypeId.errorMessage"
                  @blur="form.stakingTypeId.blur"
                />
              </div>
            </div>

            <p class="staking-form-founds-step__info-type">
              {{ $t(`info-staking-type-${form.stakingTypeId.value}`) }}
            </p>

            <div class="app__form-row">
              <div class="app__form-field">
                <amount-field
                  v-model="form.amount.value"
                  @blur="form.amount.blur"
                  name="staking-form-founds-step-amount"
                  :error-message="form.amount.errorMessage"
                  :label="$t('amount-input-lbl')"
                  :disabled="isFormDisabled"
                />
              </div>
            </div>

            <transition name="staking-form-founds-step__err-transition">
              <error-message
                v-if="isInsufficientAmount"
                class="staking-form-founds-step__error-amount"
                :header="$t('error-message-header')"
                :message="partialFee.isZero()
                  ? $t('error-message-amount', { amount: $fbalance(partialFee)})
                  : $t('error-message-commission', {
                    amount: $fbalance(partialFee)
                  })
                "
              />
            </transition>

            <div class="staking-form-founds-step__actions-wrap">
              <app-button
                size="big"
                scheme="primary"
                type="submit"
                :text="$t('next-btn')"
                :disabled="buttonDisabled"
              />
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <loader />
      </template>
    </form>
  </div>
</template>

<script>
import { AmountField, SelectField } from '@/vue/fields'
import Loader from '@/vue/common/Loader'

import { reactive, toRefs, computed, watch } from 'vue'
import { api } from '@api'
import { useValidators, useForm, useGlobalTranslation } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { TRANSFER_FORM_STEPS } from '@/js/const/steps.const'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { CONFIG } from '@/config'
import ErrorMessage from '@/vue/common/ErrorMessage'
import BN from 'bn.js'

const EVENTS = {
  nextStep: 'next-step',
}

const MIN_TRANSFER_AMOUNT = 1 // pico unit

export default {
  name: 'staking-form-founds-step',

  components: { AmountField, ErrorMessage, SelectField, Loader },

  props: {
    myAccounts: { type: Array, required: true },
    former: { type: TransferFormer, required: true },
    stakingOptions: {
      type: Array, /** {@link StakingOptionRecord} **/
      required: true,
    },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { globalize } = useGlobalTranslation()

    const state = reactive({
      existentialDeposit: api.consts.balances.existentialDeposit,
      partialFee: new BN(0),
      senderBalances: null,
      unsubscribeBalances: null,
    })

    const stakingTypes = computed(() => {
      return props.stakingOptions.map(item => ({
        id: item.id,
        name: globalize(item.nameTranslationId),
      }))
    })
    const isInsufficientAmount = computed(() => {
      if (!state.senderBalances) return
      const bnAmount = new BN(formController.form.amount.value)
      const amountWithFee = state.partialFee.add(bnAmount)
      return state.senderBalances.availableBalance.lt(amountWithFee)
    })
    const buttonDisabled = computed(() => {
      return formController.isFormDisabled.value || isInsufficientAmount.value
    })
    const accounts = computed(() => {
      return props.myAccounts.map(account => {
        return {
          name: account.meta.name || account.address,
          address: account.address,
        }
      })
    })

    const { required, amountRange } = useValidators()
    const formController = useForm({
      senderAddress: {
        value: props.former.attrs.senderAddress || accounts.value[0].address,
        validators: { required },
      },
      stakingTypeId: {
        value: props.former.attrs.stakingTypeId || stakingTypes.value[0].id,
        validators: { required },
      },
      amount: {
        value: props.former.attrs.amount || 0,
        validators: computed(() => ({
          required,
          ...(state.senderBalances
            ? {
                amountRange: amountRange(
                  MIN_TRANSFER_AMOUNT,
                  state.senderBalances.availableBalance,
                ),
              }
            : {}
          ),
        })),
      },
    })

    async function nextStep () {
      formController.disableForm()
      try {
        props.former.setAttr('senderAddress', formController.form.senderAddress.value)
        props.former.setAttr('recipientAddress', CONFIG.STAKING_SYSTEM_ADDRESS)
        props.former.setAttr('amount', formController.form.amount.value)
        props.former.setAttr('isKeepAlive', true)
        props.former.setAttr('stakingTypeId', formController.form.stakingTypeId.value)
        await props.former.initTx()

        state.partialFee = props.former.attrs.paymentInfo.partialFee

        if (isInsufficientAmount.value) {
          formController.enableForm()
          return
        }

        emit(EVENTS.nextStep, TRANSFER_FORM_STEPS.authorize)
      } catch (e) {
        ErrorHandler.process(e)
      }
      formController.enableForm()
    }

    async function subscribeBalance () {
      if (state.unsubscribeBalances) state.unsubscribeBalances()
      if (!formController.form.senderAddress.value) return

      state.senderBalances = null
      const balanceHandler = (ev) => { state.senderBalances = ev }

      state.unsubscribeBalances = await api.derive.balances
        .all(formController.form.senderAddress.value, balanceHandler)
    }

    watch(
      () => formController.form.senderAddress.value,
      subscribeBalance,
      { immediate: true },
    )

    return {
      ...toRefs(state),
      ...formController,
      accounts,
      stakingTypes,
      nextStep,
      isInsufficientAmount,
      buttonDisabled,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-form-founds-step {
  padding: 0 $drawer-padding;
}

.staking-form-founds-step__body {
  margin-top: 2rem;
}

.staking-form-founds-step__title {
  margin-bottom: 1rem;
  color: $col-app-header-secondary;
  font-size: 1.6rem;
}

.staking-form-founds-step__balance-value {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.staking-form-founds-step__deposit-value {
  font-size: 1.6rem;
  margin-bottom: 4rem;
}

.staking-form-founds-step__actions-wrap {
  margin-top: 3rem;
  width: 100%;
}

.staking-form-founds-step__info-type {
  color: $col-app-secondary;
  margin-top: 1rem;
}

.staking-form-founds-step__error-amount {
  margin-top: 4rem;
}

.staking-form-founds-step__err-transition-enter-active {

  animation: err-keyframes  0.2s ease-in-out;
}

.staking-form-founds-step__err-transition-leave-active {
  animation: err-keyframes  0.2s ease-in-out reverse;
}

@keyframes err-keyframes {
  from {
    opacity: 0;
    height: 0;
    margin-top: 0;
    overflow: hidden;
  }

  to {
    opacity: 1;
    height: 100%;
    margin-top: 4rem;
    overflow: visible;
  }
}
</style>

<i18n>
{
  "en": {
    "select-field-current-account-lbl": "Account",
    "balance-title": "Balance",
    "deposit-title": "Existential deposit",
    "amount-input-lbl": "Amount",
    "next-btn": "Next",
    "info-staking-type-1": "Awakening Temple - 24%, no lock-up, minimum 1-month staking required",
    "info-staking-type-2": "Exploration Temple - 88-day lock-up - 67% APY",
    "info-staking-type-3": "Perception Temple - 177-day lock-up - 200% APY",
    "info-staking-type-4": "Enlightenment Temple - 355 days - 500% APY",
    "info-staking-type-5": "Transcendence Temple - 710-day lock-up - 400% APY",
    "info-staking-type-6": "Immortality Temple - 300% APY - 1420-day lock-up",
    "error-message-header": "Insufficient funds",
    "error-message-commission": "You do not have enough funds to pay the commission ({ amount }). Please change amount to continue the operation.",
    "error-message-amount": "You do not have enough funds. Please change amount to continue the operation",
    "select-field-staking-type-lbl": "Staking type"
  }
}
</i18n>
