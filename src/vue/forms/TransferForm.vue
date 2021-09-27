<template>
  <div class="transfer-form">
    <div class="transfer-form__steps-wrap">
      <steps
        v-model:current-step="currentStep"
        class="transfer-form__steps"
        :steps-count="Object.values(TRANSFER_FORM_STEPS).length"
      />
    </div>

    <div class="transfer-form__address-send-wrap">
      <h3 class="transfer-form__send-title">
        {{ $t('send-from-title') }}
      </h3>
      <div class="transfer-form__address-wrap">
        <account-address-row
          :account-address="fromAccountAddress"
          icon-size="big"
        />
      </div>
    </div>

    <div
      v-if="currentStep === TRANSFER_FORM_STEPS.authorize"
      class="transfer-form__address-send-wrap"
    >
      <h3 class="transfer-form__send-title">
        {{ $t('send-to-title') }}
      </h3>
      <div class="transfer-form__address-wrap">
        <account-address-row
          :account-address="former.attrs.recipientAddress"
          icon-size="big"
        />
      </div>
    </div>

    <template v-if="senderBalances">
      <div class="transfer-form__forms">
        <transfer-send-founds-step
          v-if="currentStep === TRANSFER_FORM_STEPS.send"
          :sender-address="fromAccountAddress"
          :former="former"
          :sender-balances="senderBalances"
          @next-step="toStep"
        />
        <transfer-send-authorize-step
          v-if="currentStep === TRANSFER_FORM_STEPS.authorize"
          :former="former"
          :sender-balances="senderBalances"
          @submit="closeDrawer"
        />
      </div>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import Steps from '@/vue/common/Steps'
import AccountAddressRow from '@/vue/common/AccountAddressRow'
import TransferSendFoundsStep from '@/vue/forms/transfer-form/TransferSendFoundsStep'
import TransferSendAuthorizeStep from '@/vue/forms/transfer-form/TransferSendAuthorizeStep'
import Loader from '@/vue/common/Loader'

import { reactive, toRefs } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { TransferFormer } from '@/js/formers/TransferFormer'
import { TRANSFER_FORM_STEPS } from '@/js/const/steps.const'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'transfer-form',

  components: {
    Steps,
    AccountAddressRow,
    TransferSendFoundsStep,
    TransferSendAuthorizeStep,
    Loader,
  },

  props: {
    fromAccountAddress: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      currentStep: TRANSFER_FORM_STEPS.send,
    })

    const senderBalances = useCall(
      api.derive.balances.all,
      [props.fromAccountAddress],
    )

    const former = new TransferFormer()

    function toStep (step) {
      state.currentStep = step
    }

    function closeDrawer () {
      emit(EVENTS.closeDrawer, false)
    }

    return {
      ...toRefs(state),
      toStep,
      TRANSFER_FORM_STEPS,
      former,
      closeDrawer,
      senderBalances,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.transfer-form {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @include scrollbar;
}

.transfer-form__steps-wrap {
  margin-bottom: 3rem;
  padding: 0 $drawer-padding;

  .transfer-form__steps {
    justify-content: start;
  }
}

.transfer-form__address-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.transfer-form__address-send-wrap {
  & + & {
    margin-top: 2rem;
  }
}

.transfer-form__send-title {
  padding: 0 $drawer-padding;
  margin-bottom: 1rem;
}

.transfer-form__forms {
  margin-top: 4rem;
}

</style>

<i18n>
{
  "en": {
    "send-from-title": "Sender From",
    "send-to-title": "Send To"
  }
}
</i18n>
