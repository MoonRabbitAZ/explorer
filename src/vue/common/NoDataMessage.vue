<template>
  <div
    class="no-data-message"
    :class="{'no-data-message--row': isRowBlock}"
  >
    <p class="no-data-message__message">
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    message: { type: String, default: '' },
    isRowBlock: { type: Boolean, default: false },
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

  &--row {
    @include content-block;

    .no-data-message__message {
      font-size: 1.2rem;
      color: $col-app-no-data;
    }
  }
}

.no-data-message__message {
  font-size: 1.6rem;
}
</style>
