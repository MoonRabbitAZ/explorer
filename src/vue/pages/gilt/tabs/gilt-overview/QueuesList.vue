<template>
  <div class="queues-list">
    <h1 class="queues-list__header">
      {{ $t('gilt-page.queues-list.queues-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="queues-list__body"/>
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
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.queues-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
