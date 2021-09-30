<template>
  <div class="create-account-seed-step">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.type.value"
          :options="seedTypesOptions"
          :label="$t('forms.create-account-seed-step.select-field-type-lbl')"
          :can-deselect="false"
          :error-message="form.type.errorMessage"
          @blur="form.type.blur"
        />
      </div>
    </div>

    <div
      v-if="isImportAccount"
      class="app__form-row"
    >
      <div class="app__form-field">
        <input-field
          v-model="form.seed.value"
          @blur="form.seed.blur"
          name="creaete-account-seed"
          :error-message="form.seed.errorMessage"
          :label="$t('forms.create-account-seed-step.seed-input-lbl')"
          :placeholder="
            $t('forms.create-account-seed-step.seed-input-placeholder')
          "
        />
      </div>
    </div>

    <div
      v-else
      class="create-account-seed-step__seed"
    >
      <p
        class="create-account-seed-step__seed-word"
        v-for="(word, id) in arraySeed"
        :key="word + id"
      >
        <span
          v-if="arraySeed.length > 1"
          class="create-account-seed-step__seed-word-number"
        >
          {{ `${id + 1}. ` }}
        </span>
        {{ word }}
      </p>

      <app-button
        class="create-account-seed-step__copy-btn"
        scheme="secondary"
        :text="$t('forms.create-account-seed-step.copy-btn')"
        @click="copySeed"
      />

      <p class="create-account-seed-step__seed-info">
        {{ $t('forms.create-account-seed-step.seed-info') }}
      </p>

      <tick-field
        class="create-account-seed-step__have-seed-field"
        v-model="form.isHaveSeed.value"
        cb-value=""
        name="processing-personal-data-form-confirm-date"
        :label="$t('forms.create-account-seed-step.have-seed-field-lbl')"
      />
    </div>

    <div class="create-account-seed-step__actions-wrap">
      <app-button
        class="create-account-seed-step__next-btn"
        size="big"
        scheme="primary"
        :text="$t('forms.create-account-seed-step.next-btn')"
        :disabled="isImportAccount ? false : !form.isHaveSeed.value"
        @click="nextStep"
      />
    </div>
  </div>
</template>

<script>
import { SelectField, TickField, InputField } from '@/vue/fields'

import { reactive, toRefs, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useValidators } from '@/vue/composables'
import { u8aToHex } from '@polkadot/util'
import { mnemonicGenerate, randomAsU8a } from '@polkadot/util-crypto'
import { keyring } from '@polkadot/ui-keyring'

import { AccountFormer } from '@/js/formers/AccountFormer'
import { SEED_TYPES } from '@/js/const/seed-types.const'
import { CREATE_ACCOUNT_FORM_STEPS } from '@/js/const/steps.const'

const EVENTS = {
  updateAccountAddress: 'update-account-address',
  nextStep: 'next-step',
}

const DEFAULT_PAIR_TYPE = 'sr25519'

export default {
  name: 'create-account-seed-step',

  components: { SelectField, TickField, InputField },

  props: {
    accountAddress: { type: String, default: '' },
    former: { type: AccountFormer, required: true },
    isImportAccount: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { t } = useI18n()

    const state = reactive({
      seed: props.former.attrs.seed,
      arraySeed: props.former.attrs.seed.split(' '),
      address: props.accountAddress,
    })

    const seedTypesOptions = [
      { label: t('seed-types.mnemonic'), value: SEED_TYPES.mnemonic },
      { label: t('seed-types.raw'), value: SEED_TYPES.raw },
    ]

    const { required, mnemonicSed, hexSeed } = useValidators()

    const formController = useForm({
      type: {
        value: props.former.attrs.seedType || seedTypesOptions[0].value,
        validators: { required },
      },
    })

    if (props.isImportAccount) {
      formController.addField('seed', {
        value: props.former.attrs.seed,
        validators: computed(() => ({
          required,
          seed: formController.form.type.value === SEED_TYPES.mnemonic
            ? mnemonicSed
            : hexSeed,
        })),
      })
    } else {
      formController.addField('isHaveSeed', {
        value: false,
        validators: { required },
      })
    }

    function newSeed (seedType) {
      if (seedType === SEED_TYPES.mnemonic) {
        return mnemonicGenerate()
      } else {
        return u8aToHex(randomAsU8a())
      }
    }

    function copySeed () {
      navigator.clipboard.writeText(state.seed)
    }

    function addressFromSeed (seed) {
      return keyring.createFromUri(seed, {}, DEFAULT_PAIR_TYPE).address
    }

    function setSeed () {
      if (props.isImportAccount) {
        state.address = formController.form.seed.isValid
          ? addressFromSeed(formController.form.seed.value)
          : ''
      } else {
        state.seed = newSeed(formController.form.type.value)
        state.arraySeed = state.seed.split(' ')
        state.address = addressFromSeed(state.seed)
      }

      emit(EVENTS.updateAccountAddress, state.address)
    }

    function nextStep () {
      if (formController.isFormValid()) {
        props.former.setAttr('seed', props.isImportAccount
          ? formController.form.seed.value
          : state.seed,
        )
        props.former.setAttr('pairType', DEFAULT_PAIR_TYPE)
        props.former.setAttr('seedType', formController.form.type.value)
        emit(EVENTS.nextStep, CREATE_ACCOUNT_FORM_STEPS.password)
      }
    }

    if (!state.address) setSeed()

    watch(() => props.isImportAccount
      ? [formController.form.type.value, formController.form.seed.value]
      : formController.form.type.value,
    setSeed)

    return {
      ...formController,
      ...toRefs(state),
      seedTypesOptions,
      newSeed,
      copySeed,
      nextStep,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.create-account-seed-step {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  padding: 0 $drawer-padding 3rem;
}

.create-account-seed-step__seed {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 3rem 0;
}

.create-account-seed-step__seed-word {
  display: listitem;
  padding: 1rem;
  background: $col-app-block-bg;
  border-radius: 0.4rem;
  word-break: break-all;

  @include content-block;
}

.create-account-seed-step__seed-word-number {
  font-size: 1rem;
  color: $col-app-secondary;
}

.create-account-seed-step__copy-btn {
  width: 100%;
  margin-top: 3rem;
}

.create-account-seed-step__seed-info {
  line-height: 1.6rem;
  margin: 3rem 0;
  color: $col-app-secondary;
}

.create-account-seed-step__actions-wrap {
  width: 100%;
  margin-top: auto;
}
</style>
