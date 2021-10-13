<template>
  <div class="approved-list">
    <h1 class="approved-list__header">
      {{ $t('treasury-page.approved-list.approved-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="approved-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="approved-list__no-data"
          :message="$t('treasury-page.approved-list.no-data-message')"
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
  name: 'approved-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.approved-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
