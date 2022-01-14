<template>
  <div class="info-value">
    <div class="info-value__header-block">
      <i
        v-tooltip="infoTooltip"
        class="mdi mdi-information-outline info-value__info-icon"
      />
      <h5>
        {{ header }}
      </h5>
    </div>
    <clipboard-field
      v-if="withClipboard"
      class="info-value__value-clipboard"
      :route-to="routeTo"
      :value="value"
    />
    <router-link
      v-else-if="routeTo"
      class="info-value__value"
      :to="routeTo"
    >
      {{ value }}
    </router-link>
    <p
      v-else
      class="info-value__value"
    >
      {{ value }}
    </p>
  </div>
</template>

<script>
import ClipboardField from '@/vue/fields/ClipboardField'

export default {
  name: 'info-value',

  components: {
    ClipboardField,
  },

  props: {
    header: { type: String, required: true },
    infoTooltip: { type: String, default: '' },
    value: { type: [String, Number], required: true },
    withClipboard: { type: Boolean, default: false },
    routeTo: { type: Object, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.info-value {
  display: grid;
  grid-gap: 1.2rem 4rem;
  grid-template-columns: 23rem 1fr;
  align-items: center;

  @include respond-to($tablet) {
    grid-template-columns: 1fr;
  }
}

.info-value__header-block {
  display: flex;
  align-items: center;
  width: 23rem;
  max-width: 23rem;
}

.info-value__info-icon {
  font-size: 1.6rem;
  color: $col-app-accent;
  margin-right: 1.2rem;
}

.info-value__value-clipboard {
  max-width: 100%;
  overflow: hidden;
}

.info-value__value {
  word-wrap: break-word;
  overflow: hidden;
}
</style>
