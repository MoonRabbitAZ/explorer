<template>
  <div class="tech-comm-summary">
    <div class="tech-comm-summary__content">
      <info-block
        :title="$t('tech-comm-page.tech-comm-summary.members-header')"
        value="0"
      />

      <info-block
        :title="$t('tech-comm-page.tech-comm-summary.proposals-header')"
        value="0"
      />

      <info-block
        :title="$t('tech-comm-page.tech-comm-summary.total-header')"
        value="0"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'

export default {
  name: 'tech-comm-summary',

  components: { InfoBlock },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tech-comm-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(3, min-content);
  justify-content: center;

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tech-comm-summary__term-progress {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
