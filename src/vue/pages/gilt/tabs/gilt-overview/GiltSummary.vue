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

      <info-block
        class="gilt-summary__intake"
        :title="$t('gilt-page.gilt-summary.intake-header')"
        value="5m"
        secondary-value="2m 54s"
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

const HURDCODE_CURRENT_PROGRESS = new BN(41)
const HURDCODE_TOTAL_PROGRESS = new BN(100)

export default {
  name: 'gilt-summary',

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

.gilt-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(5, min-content);

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gilt-summary__intake {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
