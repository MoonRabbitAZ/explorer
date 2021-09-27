<template>
  <div class="transfer-form-founds-step">
    <form
      novalidate
      @submit.prevent="isFormValid() && nextStep()"
    >
      <h3 class="transfer-form-founds-step__title">
        {{ $t('forms.transfer-form-founds-step.balance-title') }}
      </h3>
      <p class="transfer-form-founds-step__balance-value">
        {{ $fbalance(senderBalances.availableBalance) }}
      </p>
      <h3 class="transfer-form-founds-step__title">
        {{ $t('forms.transfer-form-founds-step.deposit-title') }}
      </h3>
      <p class="transfer-form-founds-step__deposit-value">
        {{ $fbalance(existentialDeposit) }}
      </p>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.recipientAddress.value"
            @blur="form.recipientAddress.blur"
            name="transfer-form-founds-step-recipient-address"
            :error-message="form.recipientAddress.errorMessage"
            :label="$t('forms.transfer-form-founds-step.send-to-input-lbl')"
            :placeholder="
              $t('forms.transfer-form-founds-step.send-to-input-placeholder')
            "
            :disabled="isFormDisabled"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <amount-field
            v-model="form.amount.value"
            @blur="form.amount.blur"
            name="transfer-form-founds-step-amount"
            :error-message="form.amount.errorMessage"
            :label="$t('forms.transfer-form-founds-step.amount-input-lbl')"
            :disabled="isFormDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <switch-field
            v-model="form.isKeepAlive.value"
            name="transfer-form-founds-step-keep-alive"
            :label="$t('forms.transfer-form-founds-step.keep-alive-switch-lbl')"
            :disabled="isFormDisabled"
          />
        </div>
      </div>

      <transition name="transfer-form-founds__err-transition">
        <error-message
          v-if="isInsufficientAmount"
          class="transfer-form-founds__error-amount"
          :header="$t('forms.transfer-form-founds-step.error-message-header')"
          :message="partialFee.isZero()
            ? $t('forms.transfer-form-founds-step.error-message-amount',
                 { amount: $fbalance(partialFee)})
            : $t('forms.transfer-form-founds-step.error-message-commission',
                 { amount: $fbalance(partialFee)})
          "
        />
      </transition>

      <div class="transfer-form-founds-step__actions-wrap">
        <app-button
          size="big"
          scheme="primary"
          type="submit"
          :text="$t('forms.transfer-form-founds-step.next-btn')"
          :disabled="buttonDisabled"
        />
      </div>

      <div class="transfer-form-founds-step__info">
        <p class="transfer-form-founds-step__info-message">
          {{ $t('forms.transfer-form-founds-step.info-message-part-1') }}
        </p>
        <p class="transfer-form-founds-step__info-message">
          {{ $t('forms.transfer-form-founds-step.info-message-part-2') }}
        </p>
        <p class="transfer-form-founds-step__info-message">
          {{ $t('forms.transfer-form-founds-step.info-message-part-3') }}
        </p>
        <p class="transfer-form-founds-step__info-message">
          {{ $t('forms.transfer-form-founds-step.info-message-part-4') }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { InputField, AmountField, SwitchField } from '@/vue/fields'

import { reactive, toRefs, computed } from 'vue'
import { api } from '@api'
import { useValidators, useForm } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { TRANSFER_FORM_STEPS } from '@/js/const/steps.const'
import { TransferFormer } from '@/js/formers/TransferFormer'
import ErrorMessage from '@/vue/common/ErrorMessage'
import BN from 'bn.js'

const EVENTS = {
  nextStep: 'next-step',
}

const MIN_TRANSFER_AMOUNT = 1 // pico unit

export default {
  name: 'transfer-form-founds-step',

  components: { InputField, AmountField, SwitchField, ErrorMessage },

  props: {
    senderAddress: { type: String, required: true },
    former: { type: TransferFormer, required: true },
    senderBalances: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      existentialDeposit: api.consts.balances.existentialDeposit,
      partialFee: new BN(0),
    })

    const { required, amountRange } = useValidators()
    const formController = useForm({
      recipientAddress: {
        value: props.former.attrs.recipientAddress || '',
        validators: { required },
      },
      amount: {
        value: props.former.attrs.amount || 0,
        validators: {
          required,
          amountRange: amountRange(
            MIN_TRANSFER_AMOUNT,
            props.senderBalances.availableBalance,
          ),
        },
      },
      isKeepAlive: {
        value: true,
      },
    })

    const isInsufficientAmount = computed(() => {
      const bnAmount = new BN(formController.form.amount.value)
      const amountWithFee = state.partialFee.add(bnAmount)
      return props.senderBalances.availableBalance.lt(amountWithFee)
    })
    const buttonDisabled = computed(() => {
      return formController.isFormDisabled.value ||
        props.senderAddress === formController.form.recipientAddress.value ||
        isInsufficientAmount.value
    })
    async function nextStep () {
      formController.disableForm()
      try {
        props.former.setAttr('senderAddress', props.senderAddress)
        props.former.setAttr('recipientAddress', formController.form.recipientAddress.value)
        props.former.setAttr('amount', formController.form.amount.value)
        props.former.setAttr('isKeepAlive', formController.form.isKeepAlive.value)
        props.former.setAttr('isKeepAlive', formController.form.isKeepAlive.value)
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

    return {
      ...toRefs(state),
      ...formController,
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

.transfer-form-founds-step {
  padding: 0 $drawer-padding;
}

.transfer-form-founds-step__title {
  margin-bottom: 1rem;
  color: $col-app-header-secondary;
  font-size: 1.6rem;
}

.transfer-form-founds-step__balance-value {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.transfer-form-founds-step__deposit-value {
  font-size: 1.6rem;
  margin-bottom: 4rem;
}

.transfer-form-founds-step__actions-wrap {
  margin-top: 3rem;
  width: 100%;
}

.transfer-form-founds-step__info {
  margin-top: 4rem;
}

.transfer-form-founds-step__info-message {
  color: $col-app-secondary;

  & + & {
    margin-top: 1.5rem;
  }
}

.transfer-form-founds__error-amount {
  margin-top: 4rem;
}

.transfer-form-founds__err-transition-enter-active {

  animation: err-keyframes  0.2s ease-in-out;
}

.transfer-form-founds__err-transition-leave-active {
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
