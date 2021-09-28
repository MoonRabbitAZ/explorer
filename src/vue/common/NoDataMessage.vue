<template>
  <div
    class="no-data-message"
    :class="{'no-data-message--secondary': isSecondary}"
  >
    <p
      class="no-data-message__message"
      :class="{'no-data-message__message--secondary': isSecondary}"
    >
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    message: { type: String, default: '' },
    isSecondary: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.no-data-message {
  display: flex;
  flex-direction: column;
  padding: 1.6rem;

  &--secondary {
    @include content-block;
  }
}

.no-data-message__message {
  font-size: 1.6rem;

  &--secondary {
    font-size: 1.2rem;
    color: $col-app-no-data;
  }
}
</style>
