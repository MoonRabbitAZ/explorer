<template>
  <div class="motions-list">
    <h1 class="motions-list__header">
      {{ $t('council-page.motions-list.motions-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="motions-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="motions-list__no-data"
          :message="$t('council-page.motions-list.no-data-message')"
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
  name: 'motions-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
