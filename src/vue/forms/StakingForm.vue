<template>
  <div class="staking-transfer-form">
    <template v-if="myAccounts.length">
      <div class="staking-transfer-form__steps-wrap">
        <steps
          v-model:current-step="currentStep"
          class="staking-transfer-form__steps"
          :steps-count="Object.values(STAKING_FORM_STEPS).length"
        />
      </div>

      <staking-form-founds-step
        v-if="currentStep === STAKING_FORM_STEPS.founds"
        :my-accounts="myAccounts"
        :staking-options="stakingOptions"
        :former="former"
        @next-step="toStep"
      />
      <staking-form-authorize-step
        v-if="currentStep === STAKING_FORM_STEPS.authorize"
        :former="former"
        @submit="closeDrawer"
      />
    </template>
    <template v-else>
      <no-data-message :message="$t('no-data-message')"/>
    </template>
  </div>
</template>

<script>
import Steps from '@/vue/common/Steps'
import StakingFormFoundsStep from '@/vue/forms/staking-form/StakingFormFoundsStep'
import StakingFormAuthorizeStep from '@/vue/forms/staking-form/StakingFormAuthorizeStep'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { reactive, toRefs } from 'vue'

import { TransferFormer } from '@/js/formers/TransferFormer'
import { STAKING_FORM_STEPS } from '@/js/const/steps.const'

const EVENTS = {
  closeDrawer: 'close-drawer',
}

export default {
  name: 'staking-transfer-form',

  components: {
    Steps,
    StakingFormFoundsStep,
    StakingFormAuthorizeStep,
    NoDataMessage,
  },

  props: {
    myAccounts: { type: Array, required: true },
    stakingOptions: {
      type: Array, /** {@link StakingOptionRecord} **/
      required: true,
    },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    const state = reactive({
      currentStep: STAKING_FORM_STEPS.founds,
    })

    const former = new TransferFormer()

    function toStep (step) { state.currentStep = step }

    function closeDrawer () { emit(EVENTS.closeDrawer, false) }

    return {
      ...toRefs(state),
      toStep,
      STAKING_FORM_STEPS,
      former,
      closeDrawer,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-transfer-form {
  height: 100%;
  overflow-y: auto;

  @include scrollbar;
}

.staking-transfer-form__steps-wrap {
  margin-bottom: 3rem;
  padding: 0 $drawer-padding;

  .staking-transfer-form__steps {
    justify-content: start;
  }
}
</style>

<i18n>
{
  "en": {
    "no-data-message": "No accounts available"
  }
}
</i18n>
