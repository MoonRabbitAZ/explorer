<template>
  <div class="parachains-list">
    <h1 class="parachains-list__header">
      {{ $t('parachains-page.parachains-list.parachains-header') }}
    </h1>
    <template v-if="parachainIds">
      <template v-if="parachainIds.length">
        <div class="parachains-list__body">
          <parachain-row
            v-for="parachainId in parachainIds"
            :key="parachainId"
            class="parachains-list__row"
            :parachain-id="parachainId"
            @click-button-info="openInfoDrawer"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="parachains-list__no-data"
          :message="$t('parachains-page.parachains-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      v-model:is-shown="isInfoOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('parachains-page.parachains-list.drawer-title') }}
      </template>
      <parachain-info
        :parachain-id="currentParachainId"
        :lease-period="leasePeriod"
        :last-blocks="lastEventsBlocks[currentParachainId]"
      />
    </drawer>
  </div>
</template>

<script>
import ParachainRow from '@parachains-page/tabs/parachains-overview/ParachainRow'
import ParachainInfo from '@parachains-page/tabs/parachains-overview/ParachainInfo'
import Drawer from '@/vue/common/Drawer'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { ref, reactive, watch } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'

export default {
  name: 'parachains-list',

  components: {
    ParachainRow,
    ParachainInfo,
    SkeletonLoader,
    NoDataMessage,
    Drawer,
  },

  props: {
    parachainIds: { type: Array, default: () => ([]) },
    leasePeriod: { type: Object, default: null },
  },

  setup () {
    const lastEventsBlocks = reactive({})
    const isInfoOpen = ref(false)
    const currentParachainId = ref('')

    const lastBlock = useCall(api.derive.chain.subscribeNewBlocks)

    function openInfoDrawer (parachainId) {
      currentParachainId.value = parachainId
      isInfoOpen.value = true
    }

    function extractEvents () {
      if (!lastBlock.value) return
      const blockNumber = lastBlock.value.block.header.number.unwrap()

      lastBlock.value.events.forEach(({ event, phase }) => {
        if (phase.isApplyExtrinsic) {
          const descriptor = event.data[0]?.descriptor
          if (!descriptor) return

          const paraId = descriptor.paraId.toString()
          const inclusion = api.events.paraInclusion || api.events.inclusion ||
            api.events.parasInclusion

          lastEventsBlocks[paraId] = lastEventsBlocks[paraId]
            ? lastEventsBlocks[paraId]
            : {
                backed: null,
                included: null,
                timeout: null,
              }

          if (inclusion?.CandidateBacked.is(event)) {
            lastEventsBlocks[paraId].backed = blockNumber
          } else if (inclusion.CandidateIncluded.is(event)) {
            lastEventsBlocks[paraId].included = blockNumber
          } else if (inclusion?.CandidateTimedOut.is(event)) {
            lastEventsBlocks[paraId].timeout = blockNumber
          }
        }
      })
    }

    watch(lastBlock, extractEvents, { immediate: true })

    return {
      isInfoOpen,
      openInfoDrawer,
      currentParachainId,
      lastEventsBlocks,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachains-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.parachains-list__body {
  display: grid;
  grid-gap: 0.4rem 2rem;
  grid-template-columns: repeat(auto-fill, minmax(50rem, 1fr));

  @include scrollbar;
  @include respond-to($small) {
    grid-template-columns: 1fr;
  }
}

</style>
