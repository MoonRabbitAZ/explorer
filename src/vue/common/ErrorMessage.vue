<template>
  <div
    class="error-message"
    :class="{'error-message--without-header': !header}"
  >
    <h2 class="error-message__header">
      <icon
        class="error-message__icon"
        name="alert"
      />
      <template v-if="header">
        {{ header }}
      </template>
    </h2>
    <p class="error-message__message">
      <template v-if="message">
        {{ message }}
      </template>
      <template v-else>
        <slot/>
      </template>
    </p>
  </div>
</template>

<script>
import Icon from '@/vue/common/Icon'

export default {
  name: 'transfer-form-founds-step',

  components: { Icon },

  props: {
    header: { type: String, default: '' },
    message: { type: String, default: '' },
    isCenter: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.error-message {
  &--without-header {
    display: flex;
    align-items: center;

    .error-message__header {
      margin-right: 2rem;
      margin-bottom: 0;
    }

    .error-message__icon {
      width: 3.6rem;
      height: 3.6rem;
      margin-right: 0;
    }

    .error-message__message {
      font-size: 1.4rem;
    }
  }
}

.error-message__icon {
  width: 2.4rem;
  height: 2.4rem;
  color: $col-app-error;
  margin-right: 1rem;
}

.error-message__header {
  display: flex;
  align-items: center;
  color: $col-app-error;
  margin-bottom: 2rem;
}

.error-message__message {
  color: $col-app-error;
}
</style>
