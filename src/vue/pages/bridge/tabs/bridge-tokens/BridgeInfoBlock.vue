<template>
  <div class="bridge-info-block">
    <h5
      v-if="header"
      class="bridge-info-block__header"
      :class="{ 'bridge-info-block__header--secondary': isHeaderSecondary }"
    >
      {{ header }}
    </h5>
    <div class="bridge-info-block__body">
      <div
        v-if="imgUrl"
        class="bridge-info-block__img-wrap"
      >
        <img
          class="bridge-info-block__img"
          :src="imgUrl"
          alt="image"
        >
      </div>
      <div class="bridge-info-block__value-wrap">
        <h2
          class="bridge-info-block__value"
          :class="{ 'bridge-info-block__value--single': !secondaryValue}"
        >
          {{ value }}
        </h2>
        <p
          v-if="secondaryValue"
          class="bridge-info-block__value-secondary"
        >
          {{ secondaryValue }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bridge-info-block',

  props: {
    imgUrl: { type: String, default: '' },
    value: { type: String, required: true },
    secondaryValue: { type: String, default: '' },
    header: { type: String, default: '' },
    isHeaderSecondary: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-info-block__header {
  margin-bottom: 1rem;

  &--secondary {
    color: $col-app-header-secondary;
  }
}

.bridge-info-block__body {
  display: flex;
  gap: 1.4rem;
  padding: 1.6rem;
  border-radius: 0.4rem;
  background: $col-app-block-bg;
}

.bridge-info-block__img-wrap {
  width: 3.2rem;
  height: 3.2rem;
  min-width: 3.2rem;
  max-width: 3.2rem;
}

.bridge-info-block__img {
  width: 100%;
  height: 100%;
}

.bridge-info-block__value-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.bridge-info-block__value,
.bridge-info-block__value-secondary {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bridge-info-block__value {
  &--single {
    font-size: 1.4rem;
  }
}

.bridge-info-block__value-secondary {
  color: $col-app-secondary;
}

</style>
