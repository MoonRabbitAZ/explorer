<template>
  <div
    class="transaction-status"
    :class="{'transaction-status--error': isError}"
  >
    <icon
      class="transaction-status__icon"
      :name="iconName"
    />
    <p class="transaction-status__message">
      {{ message }}
    </p>
  </div>
</template>

<script>
import Icon from '@/vue/common/Icon'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const STATUS_ERROR = 'ERROR'
export default {
  name: 'transaction-status',

  components: { Icon },

  props: {
    status: { type: String, default: '' },
  },

  setup (props) {
    const { t } = useI18n()
    const isError = computed(() => props.status === STATUS_ERROR)
    const iconName = computed(() =>
      isError.value
        ? 'alert'
        : 'success',
    )

    const message = computed(() =>
      isError.value
        ? t('evm-explorer-page.transaction-status.status-error')
        : t('evm-explorer-page.transaction-status.status-success'),
    )

    return {
      iconName,
      message,
      isError,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.transaction-status {
  display: flex;
  align-items: center;

  &--error {
    .transaction-status__icon,
    .transaction-status__message {
      color: $col-app-error;
    }
  }
}

.transaction-status__icon {
  width: 1.6rem;
  height: 1.6rem;
  color: $col-app-accent;
  margin-right: 0.6rem;
}
</style>
