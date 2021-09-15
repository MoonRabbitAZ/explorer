<template>
  <div class="chain-info-blocks">
    <last-block-timer class="chain-info-blocks__last-block-timer"/>
    <block-to-time class="chain-info-blocks__block-to-time" />
    <total-issuance class="chain-info-blocks__total-issuance" />
    <epoch-time class="chain-info-blocks__epoch-time" />

    <info-block
      class="chain-info-blocks__event-count"
      :title="$t('last-events-title')"
      :value="eventCount"
    />

    <best-number
      class="chain-info-blocks__best-number-finalized"
      is-finalized
    />
    <best-number class="chain-info-blocks__best-number" />
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import LastBlockTimer from '@/vue/common/info-blocks/LastBlockTimer'
import BlockToTime from '@/vue/common/info-blocks/BlockToTime'
import TotalIssuance from '@/vue/common/info-blocks/TotalIssuance'
import EpochTime from '@/vue/common/info-blocks/EpochTime'
import BestNumber from '@/vue/common/info-blocks/BestNumber'

import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'chain-info-blocks',

  components: {
    InfoBlock,
    LastBlockTimer,
    BlockToTime,
    TotalIssuance,
    EpochTime,
    BestNumber,
  },

  setup () {
    const store = useStore()

    const eventCount = computed(() => {
      return store.getters[vuexTypes.eventCount]
    })

    return {
      eventCount,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.chain-info-blocks {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: space-between;
  grid-gap: 2rem;

  @include respond-to($x-medium) {
    grid-template-columns: repeat(6, 1fr);
    justify-content: flex-start;
  }
}

.chain-info-blocks__last-block-timer {
  @include respond-to($x-medium) {
    grid-column: 1 / 4;
  }
}

.chain-info-blocks__block-to-time {
  @include respond-to($x-medium) {
    grid-column: 4 / -1;
  }
}

.chain-info-blocks__total-issuance {
  @include respond-to($x-medium) {
    grid-column: 1 / 4;
  }
  @include respond-to($sidebar-hide-bp) {
    grid-column: 1 / -1;
  }
}

.chain-info-blocks__epoch-time {
  @include respond-to($x-medium) {
    grid-column: 4 / -1;
  }
  @include respond-to($sidebar-hide-bp) {
    grid-column: 1 / -1;
  }
}

.chain-info-blocks__event-count {
  @include respond-to($x-medium) {
    grid-column: 1 / 3;
  }
  @include respond-to($sidebar-hide-bp) {
    grid-column: 1 / -1;
  }
}

.chain-info-blocks__best-number-finalized {
  @include respond-to($x-medium) {
    grid-column: 3 / 5;
  }
  @include respond-to($sidebar-hide-bp) {
    grid-column: 1 / 4;
  }
}

.chain-info-blocks__best-number {
  @include respond-to($x-medium) {
    grid-column: 5 / -1;
  }
  @include respond-to($sidebar-hide-bp) {
    grid-column: 4 / -1;
  }
}
</style>

<i18n>
{
  "en": {
    "last-events-title": "Last events",
  }
}
</i18n>
