<template>
  <div
    class="transaction-status"
    :class="{
      'transaction-status--error': status === STATUSES.error,
      'transaction-status--success': status === STATUSES.success,
    }"
  >
    <icon
      v-if="iconName"
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

const STATUSES = {
  error: 'error',
  success: 'success',
  pending: 'pending',
}

export default {
  name: 'transaction-status',

  components: { Icon },

  props: {
    status: { type: String, default: '' },
  },

  setup (props) {
    const { t } = useI18n()
    const iconName = computed(() => {
      switch (props.status) {
        case STATUSES.error:
          return 'alert'
        case STATUSES.success:
          return 'success'
        case STATUSES.pending:
          return 'rotate'
        default:
          return ''
      }
    })

    const message = computed(() => {
      switch (props.status) {
        case STATUSES.error:
          return t('evm-explorer-page.transaction-status.status-error')
        case STATUSES.success:
          return t('evm-explorer-page.transaction-status.status-success')
        case STATUSES.pending:
          return t('evm-explorer-page.transaction-status.status-pending')
        default:
          return t('evm-explorer-page.transaction-status.status-unknown')
      }
    })

    return {
      iconName,
      message,
      STATUSES,
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

  &--success {
    .transaction-status__icon {
      color: $col-app-accent;
    }
  }

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
  margin-right: 0.6rem;
}
</style>
