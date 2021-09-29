<template>
  <div class="select-field">
    <label
      v-if="label"
      class="select-field__label"
    >
      {{ label }}
    </label>

    <multiselect
      class="select-field__input"
      :class="{ 'select-field__input--error': isError }"
      v-model="value"
      :mode="mode"
      :options="options"
      :searchable="searchable"
      :placeholder="placeholder"
      :no-options-text="noOptionsMessage"
      :no-search-results-text="noSearchResultsMessage"
      :disabled="disabled"
      :object="object"
      :value-prop="valueProp"
      :loading="loading"
      :min-chars="minChars"
      :delay="delay"
      :track-by="trackBy"
      :filter-results="filterResults"
      :max-height="maxHeight"
      :label="optionLabel"
      :can-clear="canClear"
      :can-deselect="canDeselect"
      @select="onChange"
      @deselect="onChange"
      @change="onChange"
      @close="onClose"
      @clear="onChange"
    />
    <transition name="select-field__err-transition">
      <p v-if="isError" class="select-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'

export default {
  name: 'select-field',

  components: { Multiselect },

  /**
   * @prop {string} mode - Multiselect mode, values: 'single|multiple|tags'.
   * @prop {boolean} object - Whether the value should be stored as an object.
   *
   * If false:
   *   value: ['js','jsx','ts']
   * If true:
   *   value: [
   *     {value:'js',label:'Javascript'},
   *     {value:'jsx',label:'JSX'},
   *     {value:'ts',label:'Typescript'}
   *    ]
   *
   * @prop {array|object|function} option - When an array of objects is
   * provided it must have properties that equal to value-prop, :track-by's and
   * :label's value.
  */

  props: {
    options: { type: [Array, Object, Function], default: () => ([]) },
    object: { type: Boolean, default: false },
    modelValue: { type: [String, Number, Array], default: null },
    searchable: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    optionLabel: { type: String, default: 'label' },
    valueProp: { type: String, default: 'value' },
    trackBy: { type: String, default: 'label' },
    noOptionsMessage: { type: String, default: '' },
    noSearchResultsMessage: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    canClear: { type: Boolean, default: false },
    canDeselect: { type: Boolean, default: false },
    mode: { type: String, default: 'single' },
    errorMessage: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    minChars: { type: Number, default: 0 },
    resolveOnLoad: { type: Boolean, default: true },
    filterResults: { type: Boolean, default: true },
    delay: { type: Number, default: -1 },
    maxHeight: { type: Number, default: 160 },
  },

  emits: ['update:modelValue', 'blur', 'select'],

  data: _ => ({ value: '' }),

  computed: {
    isError () { return Boolean(this.errorMessage) },
  },

  created () { this.value = this.modelValue },

  methods: {
    onChange (value) {
      if (!value) { this.$emit('blur') }
      this.$emit('update:modelValue', value)
    },

    onClose () { this.$emit('blur') },
  },
}
</script>

<style lang="scss">
@import '@vueform/multiselect/themes/default';
@import '~@/scss/variables';
@import '~@/scss/mixins';

$multiselect-caret-size: 2rem;
$label-indentation:
  2 * $field-input-padding-horizontal + $multiselect-caret-size;

.select-field {
  position: relative;
  width: 100%;
  flex: 1;
}

.select-field__input {
  border: none;
  border-radius: 0;
  padding: $field-input-padding-vertical $field-input-padding-horizontal;
  height: 4.2rem;

  & .multiselect-placeholder,
  & .multiselect-single-label,
  & .multiselect-multiple-label {
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: $field-input-padding-horizontal;
    white-space: nowrap;
    max-width: calc(100% - #{$label-indentation});
  }

  & > .multiselect-placeholder { @include placeholder; }

  .multiselect-caret {
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'%3E%3C/path%3E%3C/svg%3E");
    height: 2rem;
    width: 2rem;
    margin: 0;
  }

  &:not([disabled]):hover {
    .multiselect-caret {
      background: $field-color-focused;
    }
  }

  @include text-field-font-sizes;
  @include field-border($field-color-unfocused, $field-color-unfocused);

  &--error {
    @include field-border($field-color-error, $field-color-error);

    & > .multiselect-placeholder,
    & > .multiselect-single-label,
    & > .multiselect-multiple-label {
      -webkit-text-fill-color: $field-color-error;
      color: $field-color-error;
    }

    & > .multiselect-caret {
      background: $field-color-error;
    }
  }

  & > .multiselect-dropdown {
    border-radius: $field-border-radius;
    border: none;
    bottom: -0.5rem;
    overflow-y: auto;
    background: $col-select-field-options-bg;

    @include scrollbar;

    & > .multiselect-options {
      border: none;

      & > span > .multiselect-no-options,
      & > span > .multiselect-no-results { color: $col-select-field-option; }

      & > .multiselect-option {
        cursor: pointer;
        color: $col-select-field-option;
        font-weight: 500;
        background: $col-select-field-options-bg;

        &.is-selected,
        &.is-selected.is-pointed {
          background: $col-select-field-option-selected;
          color: $col-select-field-option-selected-text;
        }

        &:hover {
          background: $col-select-field-option-hover;
          color: $col-select-field-option-text-hover;
        }
      }
    }
  }

  &.is-active { box-shadow: none; }

  &.is-open {
    border-radius: 0.4rem;

    @include field-border($field-color-focused, $field-color-focused);
  }

  &.is-disabled {
    background: transparent;
    pointer-events: none;

    @include readonly-field-border($field-color-disabled);

    & > .multiselect-placeholder,
    & > .multiselect-single-label,
    & > .multiselect-multiple-label {
      -webkit-text-fill-color: $field-color-disabled;
      color: $field-color-disabled;
    }

    & > .multiselect-caret {
      background: $field-color-disabled;
    }
  }

  & > .multiselect-input {
    border: none;
    border-radius: 0;

    &:before {
      color: $col-select-field-label;
      border-color: $col-select-field-label transparent transparent;
    }

    @include field-border($field-color-focused, $field-color-unfocused);

    & > .multiselect-placeholder,
    & > .multiselect-single-label,
    & > .multiselect-multiple-label {
      color: $col-select-field-label;
      padding-left: 0;

      @include text-field-font-sizes;
    }

    & > .multiselect-tags {
      padding-left: 0;

      & > span > .multiselect-tag { background: $col-select-field-label; }
    }

    & > .multiselect-placeholder { @include placeholder; }

    & > .multiselect-clear {
      background: $col-select-field-clear;
      color: $col-select-field-label;

      &:before,
      &:after { background: $col-select-field-label; }
    }

    & > .multiselect-search input { padding: 0.8rem 3.5rem 0.8rem 0; }

    & > .multiselect-spinner {
      background: transparent;

      &:before,
      &:after {
        border-color: $col-select-field-spinner transparent transparent;
      }
    }
  }

  /* stylelint-disable no-descending-specificity */
  & > .multiselect-options {
    border: none;

    & > span > .multiselect-no-options,
    & > span > .multiselect-no-results { color: $col-select-field-option; }

    & > .multiselect-option {
      cursor: pointer;
      color: $col-select-field-option;
      font-weight: 500;

      &.is-selected,
      &.is-selected.is-pointed {
        background: $col-select-field-option-selected;
      }

      &.is-pointed {
        background: $col-select-field-option-hover;
        color: $col-select-field-option-text-hover;
      }
    }
  }
  /* stylelint-enable no-descending-specificity */
}

.select-field__label {
  display: block;
  color: $field-label-color;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.8rem;

  @include label-field-font-sizes;
}

.select-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.select-field__err-transition-enter-active {
  animation:
    select-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out;
}

.select-field__err-transition-leave-active {
  animation:
    select-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out
    reverse;
}

@keyframes select-field__err-transition-keyframes {
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
