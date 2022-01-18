<template>
  <div
    class="transaction-direction"
    :class="{'transaction-direction--to': isFrom}"
  >
    <i
      class="mdi transaction-direction__icon"
      :class="iconName"
    />
    <span class="transaction-direction__message">
      {{ message }}
    </span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'transaction-direction',

  props: {
    fromAddress: { type: String, required: true },
    currentAddress: { type: String, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const isFrom = computed(() => props.currentAddress === props.fromAddress)
    const iconName = computed(() =>
      isFrom.value ? 'mdi-arrow-top-right' : 'mdi-arrow-bottom-right',
    )

    const message = computed(() =>
      isFrom.value
        ? t('evm-explorer-page.transaction-direction.status-out')
        : t('evm-explorer-page.transaction-direction.status-to'),
    )

    return {
      iconName,
      message,
      isFrom,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.transaction-direction {
  display: flex;
  align-items: center;

  &--to {
    .transaction-direction__icon {
      color: $col-app-error;
    }
  }
}

.transaction-direction__icon {
  font-size: 1.2rem;
  margin-right: 0.6rem;
  color: $col-app-accent;
}
</style>
