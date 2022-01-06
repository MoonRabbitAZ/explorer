<template>
  <div class="tip-row">
    <account-address
      :account-address="tip.who.toString()"
    />
    <div>
      <template v-if="finder">
        <account-address :account-address="finder"/>
      </template>
    </div>
    <p>
      <template v-if="tip.tips.length">
        <span v-tooltip="$fFullBalance(median)">
          {{ $fbalance(median) }}
        </span>
      </template>
    </p>
    <div class="tip-row__actions">
      <app-button
        mdi-icon-name="mdi-information-outline"
        scheme="secondary"
        @click="openTippers"
      />
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { useTipsMedian } from '@treasury-page/composables/useTipsMedian'

const EVENTS = {
  openTippers: 'open-tippers',
}

export default {
  name: 'tip-row',

  components: { AccountAddress },

  props: {
    tip: { type: Object, required: true },
    tipHash: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const finder = computed(() => {
      if (props.tip?.findersFee) {
        return props.tip.finder.toString()
      } else if (props.tip.finder.isSome) {
        const finderInfo = props.tip.finder.unwrap()
        return finderInfo[0].toString()
      } else {
        return null
      }
    })
    const tips = computed(() => props.tip.tips)

    const median = useTipsMedian(tips)

    function openTippers () {
      emit(EVENTS.openTippers, props.tipHash)
    }

    return {
      finder,
      median,
      openTippers,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tip-row {
  min-width: min-content;

  @include treasury-tip-grid-row(center, 1rem);
  @include content-block;
}

.tip-row__index {
  font-size: 1.6rem;
}

.tip-row__actions {
  justify-self: flex-end;
}
</style>
