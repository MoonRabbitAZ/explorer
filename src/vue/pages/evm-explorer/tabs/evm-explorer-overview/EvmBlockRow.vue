<template>
  <div class="evm-block-row">
    <router-link
      class="evm-block-row__block-number"
      :to="{
        ...$routes.evmExplorerBlock,
        params: {
          blockNumber: block.blockNumber,
        },
      }"
    >
      {{ block.blockNumber }}
    </router-link>
    <router-link
      class="evm-block-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        params: { hash: block.miner },
      }"
    >
      {{ block.miner }}
    </router-link>
    <p>
      {{ block.transactions }}
    </p>
    <p>
      {{ timeAgo }}
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import moment from 'moment'

export default {
  name: 'evm-block-row',

  props: {
    block: { type: Object, required: true },
    currentAddress: { type: String, default: '' },
  },

  setup () {
    const timeAgo = computed(() => moment().fromNow())

    return { timeAgo }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-block-row {
  @include evm-block-grid-row(center, 1rem);
  @include content-block;
}

.evm-block-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.evm-block-row__block-number {
  font-size: 1.6rem;
}
</style>
