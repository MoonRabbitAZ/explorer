<template>
  <div class="extrinsic-row">
    <call-expander
      :extrinsic="extrinsic"
      :block-number="blockNumber"
    />
    <div>
      <event-display
        v-for="({event}, id) in filteredEvents"
        class="extrinsic-row__event-item"
        :key="id"
        :event="event"
      />
    </div>
    <div>
      <p class="extrinsic-row__weight">
        {{ $fnumber(weight) }}
      </p>
    </div>
    <div>
      <p class="extrinsic-row__signer">
        {{ signerDisplay }}
      </p>
    </div>
  </div>
</template>

<script>
import EventDisplay from '@/vue/common/EventDisplay'
import CallExpander from '@/vue/common/CallExpander'

import { toRefs, computed } from 'vue'
import { getTypeDef } from '@polkadot/types'
import { getAddress } from '@/js/helpers/account-helper'
import { BCH_EVENT_METHODS, BCH_EVENT_SECTION } from '@/js/const/blockchain-event.const'

export default {
  name: 'extrinsic-row',

  components: {
    EventDisplay,
    CallExpander,
  },

  props: {
    extrinsic: { type: Object, required: true },
    index: { type: Number, required: true },
    events: { type: Array, required: true },
    blockNumber: { type: Number, required: true },
  },

  setup (props) {
    const { extrinsic, index, events } = toRefs(props)

    const filteredEvents = computed(() => {
      return events.value.filter(({ phase }) =>
        phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index.value),
      )
    })

    const weight = computed(() => {
      const infoRecord = filteredEvents.value
        .find(({ event: { method, section } }) =>
          section === BCH_EVENT_SECTION.system &&
            [
              BCH_EVENT_METHODS.extrinsicFailed,
              BCH_EVENT_METHODS.extrinsicSuccess,
            ].includes(method),
        )
      const dispatchInfo = infoRecord
        ? infoRecord.event.method === BCH_EVENT_METHODS.extrinsicSuccess
          ? infoRecord.event.data[0]
          : infoRecord.event.data[1]
        : undefined
      return dispatchInfo.weight
    })

    const signerDisplay = computed(() =>
      extrinsic.value.isSigned ? getAddress(extrinsic.value.signer) : '',
    )

    return {
      getTypeDef,
      filteredEvents,
      signerDisplay,
      weight,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.extrinsic-row {
  display: grid;
  grid-gap: 0 3rem;
  grid-template-columns:
    repeat(2, minmax(25rem, 1fr))
    repeat(2, minmax(12.8rem, 18rem));
}

.extrinsic-row__event-item {
  & + & {
    margin-top: 2rem;
  }
}

.extrinsic-row__weight {
  overflow: hidden;
  text-overflow: ellipsis;
}

.extrinsic-row__signer {
  overflow: hidden;
  text-overflow: ellipsis;
  color: $col-app-accent;
}
</style>
