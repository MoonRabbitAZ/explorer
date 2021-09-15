<template>
  <div class="tooltip">
    <slot />
    <transition name="tooltip-transition">
      <div
        v-if="message"
        class="tooltip__message"
      >
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'tooltip',
  props: {
    message: {
      type: String,
      default: '',
    },
  },

}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.tooltip {
  position: relative;
}

.tooltip__message {
  position: absolute;
  padding: 1.2rem 2.4rem;
  bottom: calc(100% + 1rem);
  right: 0;
  border-radius: 0.4rem;
  color: $col-app-text-dark;
  background: $col-app-accent;
  transition: opacity 0.3s;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    right: 0.5rem;
    width: 0;
    height: 0;
    border-top: 1rem solid $col-app-accent;
    border-right: 0.7rem solid transparent;
    border-left: 0.7rem solid transparent;
  }
}

.tooltip-transition-enter-active {
  transition: all 0.3s ease-out;
}

.tooltip-transition-enter-from,
.tooltip-transition-leave-to {
  opacity: 0;
}
</style>
