<template>
  <div class="staking-form-authorize-step">
    <form
      novalidate
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="staking-form-authorize-step__address-send-wrap">
        <h3 class="staking-form-authorize-step__send-title">
          {{ $t('forms.staking-form-authorize-step.stake-from-title') }}
        </h3>
        <div class="staking-form-authorize-step__address-wrap">
          <account-address-row
            :account-address="former.attrs.senderAddress"
            icon-size="big"
          />
        </div>
      </div>

      <div class="staking-form-authorize-step__body">
        <h3 class="staking-form-authorize-step__title">
          {{ $t('forms.staking-form-authorize-step.amount-title') }}
        </h3>
        <p class="staking-form-authorize-step__amount-value">
          {{ $fbalance(former.attrs.amount) }}
        </p>
        <h3 class="staking-form-authorize-step__title">
          {{ $t('forms.staking-form-authorize-step.submission-fee-title') }}
        </h3>
        <p class="staking-form-authorize-step__fee-value">
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
              name="staking-form-authorize-step-password"
              :error-message="form.password.errorMessage"
              :label="
                $t('forms.staking-form-authorize-step.password-input-lbl')
              "
              :disabled="isFormDisabled"
            />
          </div>
        </div>
      </div>

      <div class="staking-form-authorize-step__call-hash">
        <h3 class="staking-form-authorize-step__call-hash-title">
          {{ $t('forms.staking-form-authorize-step.call-hash-title') }}
        </h3>
        <div class="staking-form-authorize-step__call-hash-field-wrap">
          <clipboard-field
            :value="former.attrs.tx.method.hash.toHex()"
          />
        </div>
      </div>

      <div class="staking-form-authorize-step__actions-wrap">
        <app-button
          size="big"
          scheme="primary"
          type="submit"
          :text="$t('forms.staking-form-authorize-step.submit-btn')"
          :disabled="isFormDisabled"
        />
      </div>
    </form>
  </div>
</template>

<script>
import AccountAddressRow from '@/vue/common/AccountAddressRow'
import { InputField, ClipboardField } from '@/vue/fields'

import { reactive, toRefs, computed } from 'vue'
import { useValidators, useForm } from '@/vue/composables'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { getAccountPair, unlockAccount, lockAccount, cropAddress } from '@/js/helpers/account-helper'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@/js/errors'
import { DEFAULT_TRANSACTION_NONCE } from '@/js/const/transaction-nonce.const'
import { stakingApi } from '@api'

import { BCH_EVENT_METHODS, BCH_EVENT_SECTION } from '@/js/const/blockchain-event.const'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'staking-form-authorize-step',

  components: {
    AccountAddressRow,
    InputField,
    ClipboardField,
  },

  props: {
    former: { type: TransferFormer, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      isLoaded: false,
      partialFee: props.former.attrs.paymentInfo.partialFee,
      senderPair: getAccountPair(props.former.attrs.senderAddress),
    })

    const { required } = useValidators()

    const formController = useForm({
      password: {
        value: '',
        validators: computed(() => ({
          ...(state.senderPair?.meta.isTesting ? {} : { required }),
        })),
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
                  Bus.success('forms.staking-form-authorize-step.transaction-success')
                  Bus.emit('updateStakingList')
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

          const stakeQuery = props.former.getStakeQuery()
          await stakingApi.post('api/staking', stakeQuery)
          const unsubscribe = await props.former.attrs.tx.signAndSend(
            state.senderPair,
            { nonce: DEFAULT_TRANSACTION_NONCE },
            txHandler(() => unsubscribe()),
          )

          Bus.processing({
            messageId: 'forms.staking-form-authorize-step.transaction-processing',
            messageArgs: {
              account: cropAddress(props.former.attrs.recipientAddress),
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

.staking-form-authorize-step__body {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 $drawer-padding;
}

.staking-form-authorize-step__address-send-wrap {
  margin-bottom: 2rem;
}

.staking-form-authorize-step__send-title {
  padding: 0 $drawer-padding;
  margin-bottom: 1rem;
}

.staking-form-authorize-step__address-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.staking-form-authorize-step__title {
  margin-bottom: 1rem;
  color: $col-app-header-secondary;
}

.staking-form-authorize-step__amount-value {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.staking-form-authorize-step__fee-value {
  font-size: 1.6rem;
}

.staking-form-authorize-step__call-hash {
  margin-top: 4rem;
}

.staking-form-authorize-step__call-hash-title {
  padding: 0 $drawer-padding;
  margin-bottom: 1rem;
}

.staking-form-authorize-step__call-hash-field-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
  margin-bottom: 3rem;
}

.staking-form-authorize-step__actions-wrap {
  width: 100%;
  padding: 0 $drawer-padding;
}

</style>
