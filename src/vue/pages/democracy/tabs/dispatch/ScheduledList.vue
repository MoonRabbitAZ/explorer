<template>
  <div class="scheduled-list">
    <div
      class="scheduled-list__headers"
      :class="{'scheduled-list__headers--grid': entriesFiltered?.length}"
    >
      <h1>
        {{ $t('democracy-page.scheduled-list.scheduled-header') }}
      </h1>
      <template v-if="entriesFiltered?.length">
        <h4>
          {{ $t('democracy-page.scheduled-list.id-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.scheduled-list.remaining-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.scheduled-list.period-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.scheduled-list.count-header') }}
        </h4>
      </template>
    </div>
    <template v-if="entriesFiltered">
      <!-- TODO: remove `false` after update -->
      <template v-if="entriesFiltered.length && false">
        <template
          v-for="(entry, index) in entriesFiltered"
          :key="index"
        >
          <schedule-row
            class="scheduled-list__row"
            :entry="entry"
          />
        </template>
      </template>
      <template v-else>
        <no-data-message
          class="scheduled-list__no-data"
          :message="$t('democracy-page.scheduled-list.no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>
  </div>
</template>

<script>
import ScheduleRow from '@democracy-page/tabs/dispatch/ScheduleRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
export default {
  name: 'scheduled-list',

  components: {
    ScheduleRow,
    SkeletonLoader,
    NoDataMessage,
  },

  setup () {
    const transformEntries = {
      transform: (entries) => {
        return entries
          .filter(([_, vecSchedOpt]) =>
            vecSchedOpt.some((schedOpt) => schedOpt.isSome))
          .reduce((items, [key, vecSchedOpt]) => {
            const blockNumber = key.args[0]

            return vecSchedOpt.reduce((acc, schedOpt) => {
              if (schedOpt.isSome) {
                const {
                  call,
                  maybeId,
                  maybePeriodic,
                  priority,
                } = schedOpt.unwrap()

                acc.push({
                  blockNumber,
                  call,
                  maybeId,
                  maybePeriodic,
                  priority,
                })
              }

              return acc
            }, items)
          }, [])
      },
    }

    const bestNumber = useCall(api.derive.chain.bestNumber)

    const entries = useCall(
      api.query.scheduler.agenda.entries,
      undefined,
      transformEntries,
    )

    const entriesFiltered = computed(() => {
      if (!bestNumber.value || !entries.value) return null
      return entries.value
        .filter(({ blockNumber }) => blockNumber.gte(bestNumber.value))
    })

    return {
      entriesFiltered,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.scheduled-list {
  overflow-x: auto;

  @include scrollbar;
}

.scheduled-list__headers {
  margin-bottom: 2rem;

  &--grid {
    @include democracy-schedule-grid-row(flex-end);
  }
}

.scheduled-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>
