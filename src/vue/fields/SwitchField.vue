<template>
  <div class="switch-field">
    <button
      type="button"
      class="switch-field__toggle"
      :class="{ 'switch-field__toggle--enabled': modelValue }"
      @click="toggle"
      :disabled="disabled"
    />
    <span
      v-if="label"
      class="switch-field__label"
    >
      <template v-if="isCroped">
        {{ label.slice(0, labelLength) }}
      </template>
      <template v-else>
        {{ label }}
      </template>
    </span>
  </div>
</template>

<script>
/**
 * Switch field component represents switch for boolean values.
 *
 * To use it pass your boolean data field as a model.
 *
 * <switch-field v-model="isSwitchEnabled" />
 *
 * As long as `isSwitchEnabled` is `true`, the switch will be enabled.
 */

const EVENTS = {
  updateModelValue: 'update:modelValue',
}

export default {
  name: 'switch-field',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    isCroped: { type: Boolean, default: false },
    labelLength: { type: Number, default: 3 },
    disabled: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    function toggle () { emit(EVENTS.updateModelValue, !props.modelValue) }
    return { toggle }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';

.switch-field {
  display: flex;
  align-items: center;
}

.switch-field__toggle {
  position: relative;
  display: inline-block;
  width: 4rem;
  min-width: 4rem;
  height: 2.4rem;
  background-color: $col-switch-field-background;
  border-radius: 3.4rem;
  transition: all 0.2s;

  &:before {
    position: absolute;
    content: '';
    display: block;
    height: 2rem;
    width: 2rem;
    left: 0.1rem;
    top: 50%;
    transform: translate(0, -50%);
    background: $col-switch-field-disabled;
    transition: all 0.2s;
    border-radius: 50%;
  }

  &--enabled {
    box-shadow: none;
    background-color: $col-switch-field-enabled-background;
  }

  &--enabled:before {
    background: $col-switch-field-enabled;
    transform: translate(1.7rem, -50%);
  }
}

.switch-field__label {
  margin-left: 1rem;
  font-size: $field-label-small-font-size;
  line-height: $field-label-small-line-height;
  color: $field-color-text;
}
</style>
