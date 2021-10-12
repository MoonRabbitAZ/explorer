<template>
  <div class="auctions-summary">
    <div class="auctions-summary__content">
      <info-block
        :title="$t('parachains-page.auctions-summary.auctions-header')"
        :value="'0'"
      />
      <info-block
        :title="$t('parachains-page.auctions-summary.active-header')"
        :value="$t('parachains-page.auctions-summary.auctions-inactive-value')"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

export default {
  name: 'auctions-summary',

  components: { InfoBlock },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auctions-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(2, min-content);

  @include respond-to($x-small) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
