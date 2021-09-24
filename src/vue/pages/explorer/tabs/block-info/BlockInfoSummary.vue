<template>
  <div
    class="block-info-summary"
  >
    <div class="block-info-summary__content">
      <info-block
        class="block-info-summary__info"
        :title="$t('header-deposits')"
        :value="$fbalance(deposits)"
      />

      <info-block
        class="block-info-summary__info"
        :title="$t('header-transfers')"
        :value="$fbalance(transfers)"
      />

      <info-block
        class="block-info-summary__info"
        :title="$t('header-block-weight')"
        :value="$fnumber(weight)"
      />

      <info-block
        class="block-info-summary__info"
        :title="$t('header-event-count')"
        :value="$fnumber(events.length)"
      />

      <info-block
        class="block-info-summary__info"
        :title="$t('header-extrinsic-count')"
        :value="$fnumber(block.block.extrinsics.length)"
      />
    </div>
  </div>
</template>

<script>
import InfoBlock from '@/vue/common/InfoBlock'
import BN from 'bn.js'

import { toRefs, reactive } from 'vue'
import { api } from '@api'
import { BCH_EVENT_METHODS, BCH_EVENT_SECTION } from '@/js/const/blockchain-event.const'

export default {
  name: 'block-info-summary',

  components: {
    InfoBlock,
  },

  props: {
    events: { type: Array, required: true },
    block: { type: Object, required: true },
  },

  setup (props) {
    const { events } = toRefs(props)
    const state = reactive({
      deposits: new BN(0),
      transfers: new BN(0),
      weight: new BN(0),
      maxBlockWeight: api.consts.system.blockWeights?.maxBlock,
    })

    function extractEventDetails () {
      events.value.forEach(
        ({ event: { data, method, section } }) => {
          state.deposits = section === BCH_EVENT_SECTION.balances &&
            method === BCH_EVENT_METHODS.deposit
            ? state.deposits.iadd(data[1])
            : state.deposits

          state.transfers = section === BCH_EVENT_SECTION.balances &&
            method === BCH_EVENT_METHODS.transfer
            ? state.transfers.iadd(data[2])
            : state.transfers

          state.weight = section === BCH_EVENT_SECTION.system &&
            [
              BCH_EVENT_METHODS.extrinsicFailed,
              BCH_EVENT_METHODS.extrinsicSuccess,
            ].includes(method)
            ? state.weight.iadd(
              (method === BCH_EVENT_METHODS.extrinsicSuccess
                ? data[0]
                : data[1]
              ).weight)
            : state.weight
        })
    }

    extractEventDetails()

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-info-summary__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: repeat(5, min-content);
  justify-content: space-between;

  @include respond-to($media-small-desktop) {
    grid-template-areas: 'a a a b b b' 'c c d d e e';
    grid-template-columns: repeat(6, 1fr);
  }
  @include respond-to($sidebar-hide-bp) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'a b' 'c c' 'd e';
  }
}

.block-info-summary__info {
  @include respond-to($media-small-desktop) {
    &:nth-child(1) {
      grid-area: a;
    }

    &:nth-child(2) {
      grid-area: b;
    }

    &:nth-child(3) {
      grid-area: c;
    }

    &:nth-child(4) {
      grid-area: d;
    }

    &:nth-child(5) {
      grid-area: e;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "header-deposits": "Deposits",
    "header-transfers": "Transfers",
    "header-block-weight": "Block weight",
    "header-event-count": "Event count",
    "header-extrinsic-count": "Extrinsic count",
  }
}
</i18n>
