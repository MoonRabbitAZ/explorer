<template>
  <div class="create-account-confirm-step">
    <div class="create-account-confirm-step__body">
      <div class="create-account-confirm-step__block">
        <h3 class="create-account-confirm-step__title">
          {{ $t('forms.create-account-confirm-step.seed-title') }}
        </h3>
        <p class="create-account-confirm-step__value">
          {{ former.attrs.seed }}
        </p>
      </div>
      <div class="create-account-confirm-step__block">
        <h3 class="create-account-confirm-step__title">
          {{ $t('forms.create-account-confirm-step.keypair-title') }}
        </h3>
        <p class="create-account-confirm-step__value">
          {{ former.attrs.pairType }}
        </p>
      </div>

      <p class="create-account-confirm-step__info-message">
        {{ $t('forms.create-account-confirm-step.info-message-part-1') }}
      </p>
      <p class="create-account-confirm-step__info-message">
        {{ $t('forms.create-account-confirm-step.info-message-part-2') }}
      </p>
    </div>

    <div class="create-account-confirm-step__actions-wrap">
      <app-button
        class="create-account-confirm-step__next-btn"
        size="big"
        scheme="primary"
        type="submit"
        :text="$t('forms.create-account-confirm-step.save-btn')"
        :disabled="isDisabled"
      />
    </div>
  </div>
</template>

<script>
import { AccountFormer } from '@/js/formers/AccountFormer'

export default {
  name: 'create-account-confirm-step',

  props: {
    former: { type: AccountFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.create-account-confirm-step {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  padding: 0 $drawer-padding 3rem;
}

.create-account-confirm-step__body {
  margin-bottom: 3rem;
}

.create-account-confirm-step__block {
  & + & {
    margin-top: 2rem;
  }
}

.create-account-confirm-step__title {
  margin-bottom: 1rem;
  color: $col-app-header-secondary;
}

.create-account-confirm-step__value {
  font-size: 1.6rem;
  word-break: break-all;
}

.create-account-confirm-step__info-message {
  color: $col-app-secondary;
  margin-top: 3rem;

  & + & {
    margin-top: 1rem;
  }
}

.create-account-confirm-step__actions-wrap {
  width: 100%;
  margin-top: auto;
}
</style>
