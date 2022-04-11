<template>
  <div class="evm-block-row">
    <router-link
      class="evm-block-row__block-number"
      :to="{
        ...$routes.evmExplorerBlock,
        query: { blockNumber: block.number },
      }"
    >
      {{ block.number }}
    </router-link>
    <router-link
      class="evm-block-row__column"
      :to="{
        ...$routes.evmExplorerAddress,
        query: { hash: block.minerHash },
      }"
    >
      {{ block.minerHash }}
    </router-link>
    <p>
      {{ $fnumber(block.totalTransactionCount) }}
    </p>
    <p :key="timeNow">
      {{ timeAgo() }}
    </p>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'evm-block-row',

  props: {
    block: { type: Object, required: true },
    timeNow: { type: Date, required: true },
  },

  setup (props) {
    const timeMoment = moment(props.block.timestamp)

    const timeAgo = _ => timeMoment.fromNow()

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
