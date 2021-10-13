<template>
  <div class="bounties-list">
    <h1 class="bounties-list__header">
      {{ $t('bounties-page.bounties-list.bounties-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="bounties-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="bounties-list__no-data"
          :message="$t('bounties-page.bounties-list.no-data-message')"
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
  name: 'bounties-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounties-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
