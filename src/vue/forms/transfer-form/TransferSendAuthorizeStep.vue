<template>
  <div class="transfer-form-authorize-step">
    <form
      novalidate
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="transfer-form-authorize-step__body">
        <value-displayer
          :header="$t('forms.transfer-form-authorize-step.amount-title')"
          :value="$fbalance(former.attrs.amount)"
          :tooltip="$fFullBalance(former.attrs.amount)"
          :value-level="1"
        />

        <value-displayer
          class="transfer-form-authorize-step__partial-fee"
          :header="
            $t('forms.transfer-form-authorize-step.submission-fee-title')
          "
          :value="$fbalance(partialFee)"
          :tooltip="$fFullBalance(partialFee)"
        />

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
              :label="
                $t('forms.transfer-form-authorize-step.password-input-lbl')
              "
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
              :label="$t('forms.transfer-form-authorize-step.tip-input-lbl')"
              :disabled="isFormDisabled"
            />
          </div>
        </div>
      </div>

      <div class="transfer-form-authorize-step__call-hash">
        <h3 class="transfer-form-authorize-step__call-hash-title">
          {{ $t('forms.transfer-form-authorize-step.call-hash-title') }}
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
          :text="$t('forms.transfer-form-authorize-step.submit-btn')"
          :disabled="isFormDisabled"
        />
      </div>

      <div class="transfer-form-authorize-step__info">
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('forms.transfer-form-authorize-step.info-message-part-1') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('forms.transfer-form-authorize-step.info-message-part-2') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('forms.transfer-form-authorize-step.info-message-part-3') }}
        </p>
        <p class="transfer-form-authorize-step__info-message">
          {{ $t('forms.transfer-form-authorize-step.info-message-part-4') }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import { InputField, AmountField, ClipboardField } from '@/vue/fields'

import { reactive, toRefs, computed } from 'vue'
import { useValidators, useForm } from '@/vue/composables'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { getAccountPair, unlockAccount, lockAccount } from '@/js/helpers/account-helper'
import { cropString } from '@/js/helpers/crop-string'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@/js/errors'
import { DEFAULT_TRANSACTION_NONCE } from '@/js/const/transaction-nonce.const'

import { BCH_EVENT_METHODS, BCH_EVENT_SECTION } from '@/js/const/blockchain-event.const'

const EVENTS = {
  submit: 'submit',
}

const MIN_TIP_AMOUNT = 0 // pico unit

export default {
  name: 'transfer-form-authorize-step',

  components: {
    ValueDisplayer,
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

    function txHandler (unsubscribe) {
      return result => {
        if (!result?.status) return
        try {
          if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) =>
                section === BCH_EVENT_SECTION.system)
              .forEach(({ event: { data, method } }) => {
                if (method === BCH_EVENT_METHODS.extrinsicFailed) {
                  const [error] = data
                  let message = ''

                  if (error.isModule) {
                    const mod = error.asModule
                    const { section, name, documentation } =
                      error.registry.findMetaError(mod)

                    message = `${section}.${name}: ${documentation.join(' ')}`
                  } else {
                    message = error.toString()
                  }
                  throw new errors.TransactionError(message)
                } else if (method === BCH_EVENT_METHODS.extrinsicSuccess) {
                  Bus.success('forms.transfer-form-authorize-step.transaction-success')
                }
              })
          }
        } catch (e) {
          ErrorHandler.process(e)
        }

        if (result.isCompleted) {
          unsubscribe()
        }
      }
    }

    function submit () {
      formController.disableForm()
      setTimeout(async () => {
        try {
          unlockAccount(state.senderPair, formController.form.password.value)
          const options = {
            nonce: DEFAULT_TRANSACTION_NONCE,
            tip: formController.form.tipAmount.value,
          }
          const unsubscribe = await props.former.attrs.tx.signAndSend(
            state.senderPair,
            options,
            txHandler(() => unsubscribe()),
          )

          Bus.processing({
            messageId: 'forms.transfer-form-authorize-step.transaction-processing',
            messageArgs: {
              account: cropString(props.former.attrs.recipientAddress),
            },
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

.transfer-form-authorize-step__partial-fee {
  margin: 2rem 0 4rem;
}

.transfer-form-authorize-step__call-hash {
  margin-top: 4rem;
}

.transfer-form-authorize-step__call-hash-title {
  padding: 0 $drawer-padding;
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
