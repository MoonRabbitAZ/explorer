<template>
  <div class="queues-list">
    <div class="queues-list__headers">
      <h1 class="queues-list__header">
        {{ $t('gilt-page.queues-list.queues-header') }}
      </h1>
    </div>
    <template v-if="queueTotals">
      <template v-if="queueTotals.length">
        <div class="queues-list__body">
          <div
            v-for="queue in queueTotals"
            :key="queue.index"
            class="queues-list__row"
          >
            <p class="queues-list__queue-index">
              {{ $fnumber(queue.index) }}
            </p>
            <p>
              {{ $fnumber(queue.numItems) }}
            </p>
            <p>
              <span v-tooltip="$fFullBalance(queue.balance)">
                {{ $fbalance(queue.balance) }}
              </span>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="queues-list__no-data"
          :message="$t('gilt-page.queues-list.no-data-message')"
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
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'queues-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    queueTotals: { type: Object, default: null },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.queues-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.queues-list__row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: minmax(10rem, 1fr) 12rem 10rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}

.queues-list__queue-index {
  font-size: 1.6rem;
}

</style>
