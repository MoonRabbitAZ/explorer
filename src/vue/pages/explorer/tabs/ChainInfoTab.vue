<template>
  <div class="chain-info-tab">
    <chain-info-blocks />
    <div class="chain-info-tab__body">
      <last-blocks />
      <recent-events />
    </div>
  </div>
</template>

<script>
import LastBlocks from '@explorer-page/tabs/chain-info/LastBlocks'
import RecentEvents from '@explorer-page/tabs/chain-info/RecentEvents'
import ChainInfoBlocks from '@explorer-page/tabs/chain-info/ChainInfoBlocks'

import { useBlockTimer } from '@explorer-page/composables/useBlockTimer'

export default {
  name: 'chain-info-tab',

  components: {
    LastBlocks,
    RecentEvents,
    ChainInfoBlocks,
  },

  setup () {
    const blockTime = useBlockTimer()

    return {
      blockTime,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.chain-info-tab { @include app-padding; }

.chain-info-tab__body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 1.6rem;
  margin-top: 3rem;

  @include respond-to($media-small-tablet) {
    grid-template-columns: 1fr;
    grid-gap: 2rem;
  }
}

</style>
