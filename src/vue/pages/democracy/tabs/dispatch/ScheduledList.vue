<template>
  <div class="scheduled-list">
    <h1 class="scheduled-list__header">
      {{ $t('democracy-page.scheduled-list.scheduled-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="scheduled-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="scheduled-list__no-data"
          :message="$t('democracy-page.scheduled-list.no-data-message')"
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
  name: 'scheduled-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.scheduled-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
