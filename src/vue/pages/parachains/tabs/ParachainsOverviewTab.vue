<template>
  <div class="parachains-overview-tab">
    <parachains-summary
      class="parachains-overview-tab__summary"
      :parachains-amount="parachainIds?.length"
      :parathread-amount="threadIds?.length"
      :lease-period="leasePeriod"
    />
    <div class="parachains-overview-tab__list">
      <div class="parachains-overview-tab__list-body">
        <h1 class="parachains-overview-tab__header">
          {{ $t('parachains-page.parachains-overview-tab.parachains-header') }}
        </h1>
        <template v-if="parachainIds">
          <template v-if="parachainIds.length">
            <parachain-row
              v-for="paractainId in parachainIds"
              :key="paractainId"
              class="parachains-overview-tab__row"
              :parachain-id="paractainId"
              :lease-period="leasePeriod"
              :last-blocks="lastEventsBlocks[paractainId]"
            />
          </template>
          <template v-else>
            <no-data-message
              class="parachains-overview-tab__no-data"
              :message="
                $t('parachains-page.parachains-overview-tab.no-data-message')
              "
              is-secondary
            />
          </template>
        </template>
        <template v-else>
          <skeleton-loader />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ParachainRow from '@parachains-page/tabs/parachains-overview/ParachainRow'
import ParachainsSummary from '@parachains-page/tabs/parachains-overview/ParachainsSummary'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed, reactive, watch } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { useLeasePeriod } from '@parachains-page/composables/useLeasePeriod'
import { useThreadIds } from '@parachains-page/composables/useThreadIds'

export default {
  name: 'parachains-overview-tab',

  components: {
    ParachainRow,
    ParachainsSummary,
    SkeletonLoader,
    NoDataMessage,
  },

  setup () {
    const lastEventsBlocks = reactive({})

    const parachains = useCall(api.query.paras.parachains)
    const lastBlock = useCall(api.derive.chain.subscribeNewBlocks)
    const threadIds = useThreadIds()
    const { leasePeriod } = useLeasePeriod()

    const parachainIds = computed(() =>
      parachains.value && parachains.value.map(id => id.toString()),
    )

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
      parachainIds,
      leasePeriod,
      lastEventsBlocks,
      threadIds,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachains-overview-tab { @include app-padding; }

.parachains-overview-tab__summary {
  margin-bottom: 3rem;
}

.parachains-overview-tab__list {
  overflow-x: auto;

  @include scrollbar;
}

.parachains-overview-tab__list-body {
  min-width: 50rem;
}

.parachains-overview-tab__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.parachains-overview-tab__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
