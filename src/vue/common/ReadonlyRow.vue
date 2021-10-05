<template>
  <div class="readonly-row">
    <div class="readonly-row__body">
      <h5 class="readonly-row__label">
        {{ label }}
      </h5>
      <p class="readonly-row__value">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'readonly-row',

  props: {
    label: { type: String, required: true },
    value: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.readonly-row__body {
  display: flex;
  justify-content: space-between;
}

.readonly-row__label {
  color: $col-app-header-secondary;
}

.readonly-row__value {
  font-size: 1.2rem;
  margin-left: 2rem;
}
</style>
