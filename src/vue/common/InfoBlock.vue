<template>
  <div class="info-block">
    <div class="info-block__main">
      <h3 class="info-block__name">
        {{ title }}
      </h3>
      <p class="info-block__value">
        {{ value }}
      </p>
      <p
        v-if="isSecondaryValueDisplay"
        class="info-block__secondary-value"
      >
        {{ secondaryValue }}
      </p>
    </div>
    <div
      v-if="isSlotDisplay(SLOTS.additional)"
    >
      <slot :name="SLOTS.additional"/>
    </div>
  </div>
</template>

<script>

import { computed } from 'vue'

const SLOTS = {
  additional: 'additional',
}

export default {
  name: 'info-block',

  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    secondaryValue: { type: [String, Number], default: '' },
  },

  setup (props, { slots }) {
    function isSlotDisplay (slotName) {
      return !!slots[slotName]
    }

    const isSecondaryValueDisplay = computed(() =>
      !!String(props.secondaryValue),
    )

    return {
      isSlotDisplay,
      isSecondaryValueDisplay,
      SLOTS,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.info-block {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  min-height: $min-height-info-block;

  @include content-block;
}

.info-block__name {
  margin-bottom: 0.3rem;
  white-space: nowrap;
  color: $col-app-header-secondary;
}

.info-block__value {
  font-size: 1.6rem;
  white-space: nowrap;
  margin-bottom: 0.3rem;
}

.info-block__secondary-value {
  font-size: 1.2rem;
  white-space: nowrap;
}

</style>
