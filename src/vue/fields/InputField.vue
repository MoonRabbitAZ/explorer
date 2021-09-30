<template>
  <div
    class="input-field"
    :class="[
      {
        'input-field--error': errorMessage,
        'input-field--readonly': $attrs.readonly || $attrs.readonly === '',
        'input-field--disabled': $attrs.disabled,
        'input-field--pwd-toggle-present': isPasswordType,
      }
    ]"
  >
    <label
      v-if="label"
      class="input-field__label"
      :from="id"
    >
      {{ label }}

      <template v-if="isCapsLockOn">
        {{ $t('fields.input-field.caps-lock-warning') }}
      </template>
    </label>

    <div class="input-field__input-wrap">
      <input
        v-bind="$attrs"
        :value="modelValue"
        :id="id"
        class="input-field__input"
        :class="{ 'input-field__input--autofill-white': whiteAutofill }"
        :aria-label="label"
        :type="isPasswordType && isPasswordShown ? 'text' : type"
        :placeholder="$attrs.placeholder || ' '"
        :tabindex="$attrs.readonly || $attrs.readonly === ''
          ? -1
          : $attrs.tabindex"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      >

      <button
        v-if="isPasswordType"
        type="button"
        class="input-field__password-toggle"
        @click="isPasswordShown = !isPasswordShown"
      >
        <i
          class="mdi input-field__password-toggle-icon"
          :class="isPasswordShown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        />
      </button>
    </div>

    <transition name="input-field__err-transition">
      <p v-if="errorMessage" class="input-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'

const EVENTS = {
  updateModelValue: 'update:modelValue',
  blur: 'blur',
}

const INPUT_TYPES = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
}

const inputTypeValidator = v => !v || Object.values(INPUT_TYPES).includes(v)

export default {
  name: 'input-field',

  props: {
    label: { type: String, default: '' },
    modelValue: { type: [String, Number], default: '' },
    errorMessage: { type: String, default: '' },
    type: {
      type: String,
      default: INPUT_TYPES.text,
      validator: inputTypeValidator,
    },
    whiteAutofill: { type: Boolean, default: true },
    trim: { type: Boolean, default: true },
  },

  emits: Object.values(EVENTS),

  data: () => ({ isCapsLockOn: false, isPasswordShown: false }),

  computed: {
    id () { return `tick-field-${getCurrentInstance().uid}` },
    isPasswordType () { return this.type === INPUT_TYPES.password },
  },

  methods: {
    onInput (event) {
      const value = event.target.value
      if (this.modelValue === value) return
      this.$emit(EVENTS.updateModelValue, value)
    },

    onFocus (event) {
      if (this.isPasswordType) {
        /**
         * Use two events to detect Caps Lock up and down.
         * If we will use only 'keydown', we can detect only Caps Lock press to
         * ON state, but we cannot detect the OFF state.
         *
         * Actual only for MacOS's browsers.
         */
        document.addEventListener('keydown', this.detectCapsLock)
        document.addEventListener('keyup', this.detectCapsLock)
      }
    },

    onBlur (event) {
      if (this.isPasswordType) {
        document.removeEventListener('keydown', this.detectCapsLock)
        document.removeEventListener('keyup', this.detectCapsLock)

        if (!this.modelValue) this.isCapsLockOn = false
      }

      const value = this.trim ? event.target.value.trim() : event.target.value

      this.$emit(EVENTS.updateModelValue, value)
      this.$emit(EVENTS.blur)
    },

    /**
     * @param {KeyboardEvent} getModifierState
     *
     * @return {Boolean}
     */
    detectCapsLock (event) {
      this.isCapsLockOn =
        event.getModifierState &&
        event.getModifierState('CapsLock')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

$pwd-toggle-btn-width: 3.2rem;

.input-field {
  position: relative;
  width: 100%;
  flex: 1;
}

.input-field__input {
  -webkit-text-fill-color: $field-color-text; /* autofill hack */
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-text;
  color: $field-color-text;
  padding: $field-input-padding-vertical $field-input-padding-horizontal;
  text-overflow: ellipsis; /*  will work only when field not in the focus */

  @include field-border($field-color-focused, $field-color-unfocused);
  @include text-field-font-sizes;

  &:read-only,
  &:disabled {
    cursor: not-allowed;
    filter: grayscale(100%);
    -webkit-text-fill-color: $field-color-unfocused;
    color: $field-color-unfocused;
  }

  &::-webkit-input-placeholder { @include placeholder; }

  &::-moz-placeholder { @include placeholder; }

  &:-moz-placeholder { @include placeholder; }

  &:-ms-input-placeholder { @include placeholder; }

  &::placeholder { @include placeholder; }

  &:not(:read-only) {
    box-shadow: inset 0 0 0 5rem $field-color-background; /* autofill hack */
  }

  &--autofill-white:not([readonly]) {
    box-shadow: inset 0 0 0 5rem $field-color-background;
  }

  // Hide number arrows
  &[type='number']:not(:hover):not(:focus) {
    /* autoprefixer does not help us here */
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      /* autoprefixer does not help us here */
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--error & {
    color: $field-color-error;

    @include field-border($field-color-error, $field-color-error);

    &::-webkit-input-placeholder { @include placeholder-error; }

    &::-moz-placeholder { @include placeholder-error; }

    &:-moz-placeholder { @include placeholder-error; }

    &:-ms-input-placeholder { @include placeholder-error; }

    &::placeholder { @include placeholder-error; }
  }

  .input-field--readonly &,
  .input-field--disabled & {
    @include readonly-field-border($field-color-unfocused);
  }

  .input-field--pwd-toggle-present & {
    padding-right: $pwd-toggle-btn-width + 0.4rem;
  }
}

.input-field__password-toggle {
  position: absolute;
  right: 0.2rem;
  bottom: 0.5rem;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;

  &--autofill-white { background-color: var(--col-block-bg); }
}

.input-field__password-toggle-icon {
  position: relative;
  font-size: 2.4rem;
  top: $field-input-padding-vertical - 0.6rem;
  left: -0.5rem;
  color: $field-inner-button;
}

.input-field__label {
  display: block;
  color: $field-label-color;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0.8rem;

  @include label-field-font-sizes;

  .input-field--error > &,
  .input-field--error > .input-field__input:focus ~ & {
    color: $field-color-error;
  }

  .input-field__input:read-only ~ &,
  .input-field__input:disabled ~ & { color: $field-color-disabled; }
}

.input-field__input-wrap {
  position: relative;
}

.input-field__err-mes {
  margin-top: $field-error-margin-top;
  color: $field-color-error;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.input-field__err-transition-enter-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out;
}

.input-field__err-transition-leave-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out
    reverse;
}

@keyframes input-field__err-transition-keyframes {
  from {
    max-height: 0;
    margin-top: 0;
    overflow: hidden;
  }

  to {
    max-height: $field-error-font-size * $field-error-line-height;
    margin-top: $field-error-margin-top;
    overflow: hidden;
  }
}
</style>
