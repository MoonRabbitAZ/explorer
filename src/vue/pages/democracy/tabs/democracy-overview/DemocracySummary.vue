<template>
  <div class="democracy-summary">
    <div class="democracy-summary__content">
      <info-block
        :title="$t('democracy-page.democracy-summary.proposals-header')"
        value="0"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.total-header')"
        value="1"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.referenda-header')"
        value="0"
      />

      <info-block
        :title="$t('democracy-page.democracy-summary.total-header')"
        value="1"
      />

      <info-block
        class="democracy-summary__launch-period"
        :title="$t('democracy-page.democracy-summary.launch-period-header')"
        value="7days"
        secondary-value="5days 21hrs"
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

const HURDCODE_CURRENT_PROGRESS = new BN(15)
const HURDCODE_TOTAL_PROGRESS = new BN(100)

export default {
  name: 'democracy-summary',

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

.democracy-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(5, min-content);
  justify-content: center;

  @include respond-to($tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.democracy-summary__launch-period {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
