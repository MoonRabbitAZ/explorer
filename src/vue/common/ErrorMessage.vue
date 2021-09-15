<template>
  <div class="error-message">
    <h2 class="error-message__header">
      <icon
        class="error-message__icon"
        name="alert"
      />
      {{ header }}
    </h2>
    <p class="error-message__message">
      {{ message }}
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

.error-message__icon {
  width: 2.4rem;
  height: 2.4rem;
  color: $col-app-error;
  margin-right: 1rem;
}

.error-message__header {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  color: $col-app-error;
  margin-bottom: 2rem;
}

.error-message__message {
  color: $col-app-error;
  line-height: 1.6rem;
}
</style>
