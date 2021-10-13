<template>
  <div class="tips-list">
    <h1 class="tips-list__header">
      {{ $t('treasury-page.tips-list.tips-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="tips-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="tips-list__no-data"
          :message="$t('treasury-page.tips-list.no-data-message')"
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
  name: 'tips-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tips-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
