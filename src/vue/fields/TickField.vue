<template>
  <div class="tick-field">
    <input
      class="tick-field__input"
      type="checkbox"
      v-bind="$attrs"
      :checked="checked"
      :name="$attrs.name || id"
      :id="id"
      :value="cbValue"
      @change="onChange"
    >
    <div class="tick-field__tick" />
    <div
      v-if="label || description"
      class="tick-field__content"
    >
      <p
        v-if="label"
        class="tick-field__label"
      >
        {{ label }}
      </p>
      <p
        v-if="description"
        class="tick-field__description"
      >
        {{ description }}
      </p>
    </div>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'

const EVENTS = {
  updateModelValue: 'update:modelValue',
}

export default {
  props: {
    modelValue: { type: [String, Number, Array, Boolean], required: true },
    cbValue: { type: [String, Number, Boolean, Array, Object], default: false },
    label: { type: String, default: '' },
    description: { type: String, default: '' },
  },

  emits: Object.values(EVENTS),

  computed: {
    id () {
      return `tick-field-${getCurrentInstance().uid}`
    },
    checked () {
      const model = this.modelValue
      const value = this.cbValue
      if (typeof value === 'undefined') {
        return model
      }
      let result
      switch (this.typeof(model)) {
        case 'number':
          result = model & +value
          break
        case 'array':
          result = this.typeof(value) !== 'array'
            ? ~model.findIndex((item) => item === value)
            : value.every(item => this.arrayIncludes(model, item))
          break
        default:
          result = model
          break
      }
      return result
    },
  },
  methods: {
    onChange (event) {
      const isChecked = event.target.checked
      const model = this.modelValue
      const value = this.cbValue || isChecked
      if (typeof value === 'undefined') {
        return this.$emit(EVENTS.updateModelValue, isChecked)
      }
      switch (this.typeof(model)) {
        case 'number':
          this.$emit(
            EVENTS.updateModelValue,
            isChecked ? model + +value : model - value,
          )
          break
        case 'array':
          if (this.typeof(value) !== 'array') {
            this.$emit(EVENTS.updateModelValue, isChecked
              ? model.concat(value)
              : model.filter((item) => item !== value))
          } else {
            this.$emit(EVENTS.updateModelValue, isChecked
              ? model.concat(
                value.filter(item => !this.arrayIncludes(model, item)),
              )
              : model.filter((item) => !this.arrayIncludes(value, item)))
          }
          break
        default:
          this.$emit(EVENTS.updateModelValue, isChecked)
          break
      }
    },
    typeof (value) {
      const type = typeof value

      let result
      switch (type) {
        case 'object':
          if (Array.isArray(value)) result = 'array'
          if (value === null) result = 'null'
          break
        default:
          result = type
          break
      }
      return result
    },
    arrayIncludes (array, value) {
      return Boolean(array.find(item => item === value))
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@/scss/mixins';

// HACK: fix cut of transforms on some browsers (chrome)
$z-index-tick-field: 0;
$tick-size: 2.4rem;

.tick-field {
  position: relative;
  display: flex;
  width: fit-content;
  align-items: center;
  z-index: $z-index-tick-field;
}

.tick-field__label {
  @include label-field-font-sizes($is-small-size: true);
}

.tick-field__tick {
  width: $tick-size;
  min-width: $tick-size;
  height: $tick-size;
  cursor: pointer;
  z-index: $z-index-tick-field;
  pointer-events: none;
  position: relative;
  background-color: $field-color-background;

  @include material-border(
    $field-color-focused,
    $field-color-focused,
  );

  &:after {
    content: '';
    position: absolute;
    top: calc(50% - #{$tick-size * 0.1});
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    display: block;
    height: $tick-size * 0.5;
    width: $tick-size * 0.25;
    border: solid $col-app-text-dark;
    border-width: 0 0.2rem 0.2rem 0;
    opacity: 0;
  }

  .tick-field__input:checked ~ & {
    border: none;
    background-color: $field-color-focused;

    &:after {
      opacity: 1;
    }
  }

  .tick-field__input:disabled ~ & {
    cursor: not-allowed;
    background-color: $field-color-disabled;
  }
}

.tick-field__input {
  position: absolute;
  opacity: 0;
  height: $tick-size;
  width: $tick-size;
  left: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}

.tick-field__content {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

.tick-field__description {
  font-size: 1.2rem;
  line-height: 1.2;
}
</style>
