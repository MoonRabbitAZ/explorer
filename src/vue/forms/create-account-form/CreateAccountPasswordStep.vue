<template>
  <div class="create-account-password-step">
    <div class="create-account-password-step__body">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.name.value"
            @blur="form.name.blur"
            autocomplete="username"
            name="create-account-name"
            :error-message="form.name.errorMessage"
            :label="$t('name-input-lbl')"
            :placeholder="$t('name-input-palceholder')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.password.value"
            @blur="form.password.blur"
            autocomplete="new-password"
            name="create-account-password"
            type="password"
            :error-message="form.password.errorMessage"
            :label="$t('password-input-lbl')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.confirmPassword.value"
            @blur="form.confirmPassword.blur"
            autocomplete="new-password"
            name="create-account-confirm-password"
            type="password"
            :error-message="form.confirmPassword.errorMessage"
            :label="$t('confirm-password-input-lbl')"
          />
        </div>
      </div>

      <p class="create-account-password-step__info-message">
        {{ $t('info-message-part-1') }}
      </p>
      <p class="create-account-password-step__info-message">
        {{ $t('info-message-part-2') }}
      </p>
    </div>

    <div class="create-account-password-step__actions-wrap">
      <app-button
        class="create-account-password-step__next-btn"
        size="big"
        scheme="primary"
        :text="$t('next-btn')"
        :disabled="isNextButtonDisabled"
        @click="nextStep"
      />
    </div>
  </div>
</template>

<script>
import { InputField } from '@/vue/fields'

import { computed } from 'vue'
import { useForm, useValidators } from '@/vue/composables'

import { AccountFormer } from '@/js/formers/AccountFormer'
import { CREATE_ACCOUNT_FORM_STEPS } from '@/js/const/steps.const'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

const EVENTS = {
  nextStep: 'next-step',
}

export default {
  name: 'create-account-password-step',

  components: { InputField },

  props: {
    former: { type: AccountFormer, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { required, password, maxLength, sameAsPassword } = useValidators()

    const formController = useForm({
      name: {
        value: props.former.attrs.name,
        validators: { required },
      },
      password: {
        value: props.former.attrs.password,
        validators: {
          required,
          password,
          maxLength: maxLength(MAX_FIELD_LENGTH.password),
        },
      },
    })

    formController.addField('confirmPassword', {
      value: props.former.attrs.password,
      validators: {
        required,
        password,
        maxLength: maxLength(MAX_FIELD_LENGTH.password),
        sameAsPassword: sameAsPassword(formController.form.password),
      },
    })

    const isNextButtonDisabled = computed(() =>
      !formController.form.name.isValid ||
        !formController.form.password.isValid ||
        !formController.form.confirmPassword.isValid,
    )

    function nextStep () {
      if (formController.isFormValid()) {
        props.former.setAttr('name', formController.form.name.value)
        props.former.setAttr('password', formController.form.password.value)

        emit(EVENTS.nextStep, CREATE_ACCOUNT_FORM_STEPS.confirm)
      }
    }

    return {
      ...formController,
      isNextButtonDisabled,
      nextStep,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.create-account-password-step__body {
  margin-bottom: 3rem;
}

.create-account-password-step {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  padding: 0 $drawer-padding 3rem;
}

.create-account-password-step__info-message {
  color: $col-app-secondary;
  margin-top: 3rem;

  & + & {
    margin-top: 1rem;
  }
}

.create-account-password-step__actions-wrap {
  width: 100%;
  margin-top: auto;
}
</style>

<i18n>
{
  "en": {
    "name-input-lbl": "Account name",
    "name-input-palceholder": "Enter account name",
    "password-input-lbl": "Password",
    "confirm-password-input-lbl": "Password confirmation",
    "info-message-part-1": "The password and password confirmation for this account. This is required to authenticate any transactions made and to encrypt the keypair.",
    "info-message-part-2": "Ensure you are using a strong password for proper account protection.",
    "next-btn": "Next"
  }
}
</i18n>
