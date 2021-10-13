<template>
  <div class="council-summary">
    <div class="council-summary__content">
      <info-block
        :title="$t('council-page.council-summary.seats-header')"
        value="0/19"
      />

      <info-block
        :title="$t('council-page.council-summary.runners-up-header')"
        value="0/19"
      />

      <info-block
        :title="$t('council-page.council-summary.candidates-header')"
        value="0"
      />

      <info-block
        class="council-summary__term-progress"
        :title="$t('council-page.council-summary.term-progress-header')"
        value="1day"
        secondary-value="20hrs 30mins"
      >
        <template #additional>
          <progress-bar
            :current="HURDCODE_CURRENT_PROGRESS"
            :total="HURDCODE_TOTAL_PROGRESS"
          />
        </template>
      </info-block>
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressBar from '@/vue/common/ProgressBar'
import { BN } from '@polkadot/util'

const HURDCODE_CURRENT_PROGRESS = new BN(14)
const HURDCODE_TOTAL_PROGRESS = new BN(100)

export default {
  name: 'council-summary',

  components: { InfoBlock, ProgressBar },

  setup () {
    return {
      HURDCODE_CURRENT_PROGRESS,
      HURDCODE_TOTAL_PROGRESS,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.council-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(4, min-content);
  justify-content: center;

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.council-summary__term-progress {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
