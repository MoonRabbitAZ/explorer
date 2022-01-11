<template>
  <div class="gilt-summary">
    <div class="gilt-summary__content">
      <info-block
        :title="$t('gilt-page.gilt-summary.active-header')"
        :value="activeGiltTranslation"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.index-header')"
        :value="activeIndex"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.proportion-header')"
        :value="proportionPercent"
      />

      <info-block
        :title="$t('gilt-page.gilt-summary.target-header')"
        :value="targetPercent"
      />

      <progress-info-block
        class="gilt-summary__intake"
        :title="$t('gilt-page.gilt-summary.intake-header')"
        :current="progressIntake"
        :total="intakePeriod"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { BN, BN_HUNDRED, BN_QUINTILL, formatNumber } from '@polkadot/util'

const DIVIDOR_NU = 10_000
const DIVISOR_BN = new BN(10_000)

export default {
  name: 'gilt-summary',

  components: { InfoBlock, ProgressInfoBlock },

  props: {
    activeTotal: { type: Object, default: null },
    isActiveGilt: { type: Boolean, default: false },
  },

  setup (props) {
    const { t } = useI18n()
    const bestNumber = useCall(api.derive.chain.bestNumber)
    const intakePeriod = api.consts.gilt?.intakePeriod

    const activeGiltTranslation = computed(() =>
      props.isActiveGilt
        ? t('gilt-page.gilt-summary.queues-active-value')
        : t('gilt-page.gilt-summary.queues-inactive-value'),
    )

    const activeIndex = computed(() =>
      props.activeTotal ? formatNumber(props.activeTotal?.index) : null,
    )

    const proportionPercent = computed(() => {
      if (!props.activeTotal) return null
      const percent = props.activeTotal.proportion
        .mul(DIVISOR_BN)
        .imul(BN_HUNDRED)
        .div(BN_QUINTILL)
        .toNumber() / DIVIDOR_NU

      return `${percent.toFixed(2)}%`
    })

    const targetPercent = computed(() => {
      if (!props.activeTotal) return null
      const percent = props.activeTotal.target
        .mul(DIVISOR_BN)
        .imul(BN_HUNDRED)
        .div(BN_QUINTILL)
        .toNumber() / DIVIDOR_NU

      return `${percent.toFixed(2)}%`
    })

    const progressIntake = computed(() => {
      if (!bestNumber.value || !intakePeriod) return
      return bestNumber.value.mod(intakePeriod)
    })

    return {
      activeGiltTranslation,
      proportionPercent,
      targetPercent,
      activeIndex,
      intakePeriod,
      progressIntake,
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
