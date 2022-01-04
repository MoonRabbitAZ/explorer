<template>
  <div class="council-summary">
    <div
      class="council-summary__content"
      :class="{'council-summary__content--full': hasElections }"
    >
      <info-block
        class="council-summary__members"
        :title="$t('council-page.council-summary.seats-header')"
        :value="membersCount"
      />

      <template v-if="hasElections">
        <info-block
          :title="$t('council-page.council-summary.runners-up-header')"
          :value="runnersUpCount"
        />

        <info-block
          :title="$t('council-page.council-summary.candidates-header')"
          :value="elections?.candidateCount.toString()"
        />
      </template>

      <template v-if="elections?.termDuration">
        <progress-info-block
          class="council-summary__term-progress"
          :title="$t('council-page.council-summary.term-progress-header')"
          :current="termValue"
          :total="elections?.termDuration"
        />
      </template>
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { formatNumber } from '@polkadot/util'

export default {
  name: 'council-summary',

  components: { InfoBlock, ProgressInfoBlock },

  props: {
    elections: { type: Object, default: null },
    hasElections: { type: Boolean, default: false },
  },

  setup (props) {
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const membersCount = computed(() =>
      props.elections?.members && props.elections?.desiredSeats
        ? `${formatNumber(props.elections.members.length)} / ${formatNumber(props.elections.desiredSeats)}`
        : props.elections?.members
          ? formatNumber(props.elections.members.length)
          : null,
    )

    const runnersUpCount = computed(() =>
      props.elections?.runnersUp && props.elections?.desiredRunnersUp
        ? `${formatNumber(props.elections.runnersUp.length)} / ${formatNumber(props.elections.desiredRunnersUp)}`
        : props.elections?.runnersUp
          ? formatNumber(props.elections.runnersUp.length)
          : null,
    )

    const termValue = computed(() =>
      bestNumber.value && props.elections?.termDuration
        ? bestNumber.value.mod(props.elections.termDuration)
        : null,
    )

    return {
      membersCount,
      termValue,
      runnersUpCount,
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
  grid-template-columns: repeat(2, min-content);

  @include respond-to($tablet) {
    grid-template-columns: 1fr;
  }

  &--full {
    grid-template-columns: repeat(4, min-content);
    justify-content: center;

    @include respond-to($tablet) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.council-summary__members {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}

.council-summary__term-progress {
  @include respond-to($tablet) {
    grid-column: 1/-1;
  }
}
</style>
