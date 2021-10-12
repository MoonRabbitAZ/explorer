<template>
  <div class="parathreads-list">
    <div class="parathreads-list__body">
      <div class="parathreads-list__headers">
        <h1>
          {{ $t('parachains-page.parathreads-list.parathreads-header') }}
        </h1>
        <h4 class="parathreads-list__header-lifecycle">
          {{ $t('parachains-page.parathreads-list.lifecycle-header') }}
        </h4>
        <h4 class="parathreads-list__header-leases">
          {{ $t('parachains-page.parathreads-list.leases-header') }}
        </h4>
      </div>
      <template v-if="leasesMap && leasePeriod">
        <template v-if="leasesMap.length">
          <parathread-row
            v-for="({paraId, leases}, index) in leasesMap"
            :key="index"
            class="parathreads-list__row"
            :para-id="paraId.toString()"
            :leases="leases"
            :lease-period="leasePeriod"
          />
        </template>
        <template v-else>
          <no-data-message
            :message="$t('parachains-page.parathreads-list.no-data-message')"
            is-row-block
          />
        </template>
      </template>
      <template v-else>
        <skeleton-loader
          v-for="(item, id) in 3"
          :key="id"
          class="parathreads-list__sceleton-loader"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ParathreadRow from '@parachains-page/tabs/parathreads/ParathreadRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { useLeasePeriod } from '@parachains-page/composables/useLeasePeriod'

export default {
  name: 'parathreads-list',

  components: {
    ParathreadRow,
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    parathreadIds: { type: Array, required: true },
  },

  setup (props) {
    const { leasePeriod } = useLeasePeriod()

    const parathreadsLeases = useCall(
      api.query.slots.leases.multi,
      computed(() => ([props.parathreadIds])),
      { withParams: true },
    )

    const leasesMap = computed(() => {
      return parathreadsLeases.value?.params[0].map((paraId, index) => {
        const leases = parathreadsLeases.value?.ev[index]
          .reduce((acc, optLease, period) => {
            if (optLease.isNone) return acc

            acc.push(period)
            return acc
          }, [])

        return {
          paraId,
          leases,
        }
      })
    })
    return { leasesMap, leasePeriod }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parathreads-list__body {
  overflow-x: auto;

  @include scrollbar;
}

.parathreads-list__headers {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 8rem minmax(12rem, 1fr) 15rem 15rem 10rem;
  align-items: flex-end;
  padding: 1rem 1.6rem;
  margin-bottom: 2rem;
}

.parathreads-list__header-lifecycle {
  grid-column: 4/5;
}

.parathreads-list__header-leases {
  grid-column: 5/-1;
}

.parathreads-list__sceleton-loader,
.parathreads-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>
