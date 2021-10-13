<template>
  <div class="referendums-list">
    <h1 class="referendums-list__header">
      {{ $t('democracy-page.referendums-list.referendums-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="referendums-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="referendums-list__no-data"
          :message="$t('democracy-page.referendums-list.no-data-message')"
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
  name: 'referendums-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendums-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
