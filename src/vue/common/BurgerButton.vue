<template>
  <button
    class="burger-button"
    :class="[
      { 'burger-button--open': isOpen },
    ]"
    type="button"
    @click="toggleOpenButton"
  >
    <div class="burger-button__line" />
  </button>
</template>
<script>

const EVENTS = {
  updateIsOpen: 'update:isOpen',
}

export default {
  name: 'burger-button',

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const toggleOpenButton = () => emit(EVENTS.updateIsOpen, !props.isOpen)

    return { toggleOpenButton }
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.burger-button {
  width: 2.1rem;
  height: 1.8rem;
  position: relative;
}

.burger-button__line {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 0.3rem;
  background-color: $col-burger-btn;
  border-radius: 0.2rem;
  transition: 0.2s;

  &:after,
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 0.3rem;
    border-radius: 0.2rem;
    background-color: inherit;
    transition: 0.2s;
  }

  &:after {
    top: 0.7rem;
    left: 0;
  }

  &:before {
    left: 0;
    bottom: 0.7rem;
  }
}

.burger-button--open {
  .burger-button__line {
    transform: rotate(45deg);

    &:after {
      top: 0;
      transform: rotate(0);
    }

    &:before {
      bottom: 0;
      transform: rotate(90deg);
    }
  }
}

</style>
