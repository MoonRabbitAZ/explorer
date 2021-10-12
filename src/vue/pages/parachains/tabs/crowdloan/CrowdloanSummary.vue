<template>
  <div class="crowdloan-summary">
    <div class="crowdloan-summary__content">
      <info-block
        :title="$t('parachains-page.crowdloan-summary.founds-header')"
        :value="'0'"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

export default {
  name: 'crowdloan-summary',

  components: { InfoBlock },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.crowdloan-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(2, min-content);

  @include respond-to($x-small) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
