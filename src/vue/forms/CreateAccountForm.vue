<template>
  <div
    class="create-account-form"
    ref="createAccountForm"
  >
    <div class="create-account-form__steps-wrap">
      <steps
        v-model:current-step="currentStep"
        :steps-count="Object.values(CREATE_ACCOUNT_FORM_STEPS).length"
      />
    </div>
    <div class="create-account-form__address">
      <span
        v-if="accountAddress"
        class="create-account-form__address-text"
      >
        {{ accountAddress }}
      </span>
      <span
        v-else
        class="create-account-form__no-address"
      >
        {{ $t('no-address') }}
      </span>
    </div>

    <form
      novalidate
      class="create-account-form__body"
      @submit.prevent="submit"
    >
      <template v-if="currentStep === CREATE_ACCOUNT_FORM_STEPS.seed">
        <create-account-seed-step
          :account-address="accountAddress"
          :former="accountFormer"
          :is-import-account="isImportAccount"
          @update-account-address="setAccountAddress"
          @next-step="toStep"
        />
      </template>

      <template v-if="currentStep === CREATE_ACCOUNT_FORM_STEPS.password">
        <create-account-password-step
          :former="accountFormer"
          @next-step="toStep"
        />
      </template>

      <template v-if="currentStep === CREATE_ACCOUNT_FORM_STEPS.confirm">
        <create-account-confirm-step
          :former="accountFormer"
          :is-disabled="isDisabled"
        />
      </template>
    </form>
  </div>
</template>

<script>
import CreateAccountSeedStep from '@/vue/forms/create-account-form/CreateAccountSeedStep'
import CreateAccountPasswordStep from '@/vue/forms/create-account-form/CreateAccountPasswordStep'
import CreateAccountConfirmStep from '@/vue/forms/create-account-form/CreateAccountConfirmStep'
import Steps from '@/vue/common/Steps'

import { api } from '@api'
import { ref, reactive, toRefs, watch, nextTick } from 'vue'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { AccountFormer } from '@/js/formers/AccountFormer'
import { CREATE_ACCOUNT_FORM_STEPS } from '@/js/const/steps.const'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'create-account-form',

  components: {
    CreateAccountSeedStep,
    CreateAccountPasswordStep,
    CreateAccountConfirmStep,
    Steps,
  },

  props: {
    isImportAccount: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    const createAccountForm = ref(null)
    const accountFormer = new AccountFormer({
      genesisHash: api.genesisHash.toString(),
    })
    const state = reactive({
      currentStep: CREATE_ACCOUNT_FORM_STEPS.seed,
      accountAddress: '',
      isDisabled: false,
    })

    function setAccountAddress (address) {
      state.accountAddress = address
    }
    function toStep (step) {
      state.currentStep = step
    }
    function submit () {
      state.isDisabled = true
      nextTick(() =>
        setTimeout(async () => {
          try {
            const { json: { meta: { name } } } =
            await accountFormer.createAccount()

            emit(EVENTS.closeDrawer)
            Bus.success({
              messageId: 'forms.create-account-form.create-account-message',
              messageArgs: { name },
            })
          } catch (e) {
            ErrorHandler.process(e)
          }
          state.isDisabled = false
        }, 10))
    }

    watch(() => state.currentStep, () => {
      createAccountForm.value.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    })

    return {
      ...toRefs(state),
      setAccountAddress,
      toStep,
      CREATE_ACCOUNT_FORM_STEPS,
      accountFormer,
      submit,
      createAccountForm,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.create-account-form {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @include scrollbar;
}

.create-account-form__steps-wrap {
  margin-bottom: 3rem;
  padding: 0 $drawer-padding;
}

.create-account-form__step {
  padding-right: 0.5rem;
  padding-bottom: 1rem;
  position: relative;
  color: $col-app-text;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.2rem;
    border-radius: 0.4rem;
    background: $col-app-text;
  }

  &[disabled] {
    color: $col-app-header-secondary;

    &:after {
      background: $col-app-header-secondary;
    }
  }

  &--active {
    color: $col-app-accent;

    &:after {
      background: $col-app-accent;
    }
  }
}

.create-account-form__address {
  padding: 2rem $drawer-padding;
  background: $col-app-block-bg;
  margin-bottom: 3rem;
}

.create-account-form__address-text {
  font-size: 1.6rem;
  word-break: break-all;
}

.create-account-form__no-address {
  font-size: 1.6rem;
  color: $col-app-secondary;
}

.create-account-form__body {
  flex: 1;
}

.create-account-form__actions-wrap {
  margin-top: auto;
  width: 100%;
}
</style>

<i18n>
{
  "en": {
    "step-title": "Step { number }",
    "next-btn": "Next",
    "save-btn": "Save",
    "no-address": "The account address will appear here"
  }
}
</i18n>
