<template>
  <div class="transfer-form-authorize-step">
    <form
      novalidate
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="transfer-form-authorize-step__body">
        <h3 class="transfer-form-authorize-step__title">
          {{ $t('amount-title') }}
        </h3>
        <p class="transfer-form-authorize-step__amount-value">
          {{ $fbalance(former.attrs.amount) }}
        </p>
        <h3 class="transfer-form-authorize-step__title">
          {{ $t('submission-fee-title') }}
        </h3>
        <p class="transfer-form-authorize-step__fee-value">
          {{ $fbalance(partialFee) }}
        </p>

        <div
          v-if="!senderPair.meta.isTesting"
          class="app__form-row"
        >
          <div class="app__form-field">
            <input-field
              v-model="form.password.value"
              @blur="form.password.blur"
              type="password"
              name="transfer-form-authorize-step-password"
              :error-message="form.password.errorMessage"
              :label="$t('password-input-lbl')"
              :disabled="isFormDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <amount-field
              v-model="form.tipAmount.value"
              @blur="form.tipAmount.blur"
              name="transfer-form-authorize-step-tip-amount"
              :error-message="form.tipAmount.errorMessage"
              :label="$t('tip-input-lbl')"
              :disabled="isFormDisabled"
            />
          </div>
        </div>
      </div>

      <div class="transfer-form-authorize-step__call-hash">
        <h3 class="transfer-form-authorize-step__call-hash-title">
          {{ $t('call-hash-title') }}
        </h3>
        <div class="transfer-form-authorize-step__call-hash-field-wrap">
          <clipboard-field
            :value="former.attrs.tx.method.hash.toHex()"
          />
        </div>
      </div>

      <div class="transfer-form-authorize-step__actions-wrap">
        <app-button
          size="big"
          scheme="primary"
          type="submit"
          :text="$t('submit-btn')"
          :disabled="isFormDisabled"
        />
      </div>

      <div class="transfer-form-authorize-step__info">
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('info-message-part-1') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('info-message-part-2') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('info-message-part-3') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('info-message-part-4') }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { InputField, AmountField, ClipboardField } from '@/vue/fields'

import { reactive, toRefs, computed } from 'vue'
import { useValidators, useForm } from '@/vue/composables'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { getAccountPair, unlockAccount, lockAccount } from '@/js/helpers/account-helper'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  submit: 'submit',
}

const MIN_TIP_AMOUNT = 0 // pico unit

export default {
  name: 'transfer-form-authorize-step',

  components: {
    InputField,
    AmountField,
    ClipboardField,
  },

  props: {
    former: { type: TransferFormer, required: true },
    senderBalances: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      isLoaded: false,
      partialFee: props.former.attrs.paymentInfo.partialFee,
      senderPair: getAccountPair(props.former.attrs.senderAddress),
    })

    const isInsufficientAmount = computed(() => {
      return props.senderBalances.availableBalance
        .sub(props.former.bnAmountWithFee)
    })

    const { required, amountRange } = useValidators()

    const formController = useForm({
      password: {
        value: '',
        validators: computed(() => ({
          ...(state.senderPair?.meta.isTesting ? {} : { required }),
        })),
      },
      tipAmount: {
        value: 0,
        validators: {
          amountRange: amountRange(MIN_TIP_AMOUNT, isInsufficientAmount),
        },
      },
    })

    function submit () {
      formController.disableForm()
      setTimeout(async () => {
        try {
          unlockAccount(state.senderPair, formController.form.password.value)
          await props.former.attrs.tx.signAndSend(
            state.senderPair,
            {
              nonce: -1,
              tip: formController.form.tipAmount.value,
            })

          lockAccount(state.senderPair)
          emit(EVENTS.submit)
        } catch (e) {
          formController.enableForm()
          ErrorHandler.process(e)
        }
      }, 10)
    }

    return {
      ...toRefs(state),
      ...formController,
      submit,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.transfer-form-authorize-step__body {
  padding: 0 $drawer-padding;
}

.transfer-form-authorize-step__title {
  margin-bottom: 1rem;
  color: $col-app-header-secondary;
  font-size: 1.6rem;
}

.transfer-form-authorize-step__amount-value {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.transfer-form-authorize-step__fee-value {
  font-size: 1.6rem;
  margin-bottom: 4rem;
}

.transfer-form-authorize-step__call-hash {
  margin-top: 4rem;
}

.transfer-form-authorize-step__call-hash-title {
  padding: 0 $drawer-padding;
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.transfer-form-authorize-step__form {
  margin-top: 4rem;
}

.transfer-form-authorize-step__call-hash-field-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.transfer-form-authorize-step__actions-wrap {
  margin-top: 3rem;
  width: 100%;
  padding: 0 $drawer-padding;
}

.transfer-form-authorize-step__info {
  margin-top: 4rem;
  padding: 0 $drawer-padding;
}

.transfer-form-authorize-step__info-message {
  color: $col-app-secondary;

  & + & {
    margin-top: 1.5rem;
  }
}
</style>

<i18n>
{
  "en": {
    "amount-title": "Amount",
    "submission-fee-title": "Submission fee",
    "password-input-lbl": "Password",
    "tip-input-lbl": "Tip for faster processing",
    "call-hash-title": "Call Hash",
    "submit-btn": "Submit",
    "info-message-part-1": "The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call.",
    "info-message-part-2": "The sending account that will be used to send this transaction. Any applicable fees will be paid by this account.",
    "info-message-part-3": "Adding an optional tip to the transaction could allow for higher priority, especially when the chain is busy.",
    "info-message-part-4": "The call hash as calculated for this transaction"
  }
}
</i18n>
