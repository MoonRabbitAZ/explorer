<template>
  <div class="crowdloan-ongoing-list">
    <h1 class="crowdloan-ongoing-list__header">
      {{ $t('parachains-page.crowdloan-ongoing-list.ongoing-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="crowdloan-ongoing-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="crowdloan-ongoing-list__no-data"
          :message="
            $t('parachains-page.crowdloan-ongoing-list.no-data-message')
          "
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
  name: 'crowdloan-ongoing-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.crowdloan-ongoing-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
