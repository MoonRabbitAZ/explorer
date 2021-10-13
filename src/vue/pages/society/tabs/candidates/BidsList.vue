<template>
  <div class="bids-list">
    <h1 class="bids-list__header">
      {{ $t('society-page.bids-list.bids-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="bids-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="bids-list__no-data"
          :message="$t('society-page.bids-list.no-data-message')"
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
  name: 'bids-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bids-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
