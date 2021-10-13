<template>
  <div class="external-list">
    <h1 class="external-list__header">
      {{ $t('democracy-page.external-list.external-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="external-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="external-list__no-data"
          :message="$t('democracy-page.external-list.no-data-message')"
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
  name: 'external-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.external-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
