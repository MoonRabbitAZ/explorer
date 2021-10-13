<template>
  <div class="gilt-summary">
    <div class="gilt-summary__content">
      <info-block
        :title="$t('gilt-page.gilt-summary.active-header')"
        :value="$t('gilt-page.gilt-summary.queues-inactive-value')"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.index-header')"
        :value="'0'"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.proportion-header')"
        :value="'0%'"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.target-header')"
        :value="'0%'"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

export default {
  name: 'gilt-summary',

  components: { InfoBlock },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.gilt-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(4, min-content);

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
