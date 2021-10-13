<template>
  <div class="suspended-members-list">
    <h1 class="suspended-members-list__header">
      {{ $t('society-page.suspended-members-list.members-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="suspended-members-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="suspended-members-list__no-data"
          :message="$t('society-page.suspended-members-list.no-data-message')"
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
  name: 'suspended-members-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.suspended-members-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
