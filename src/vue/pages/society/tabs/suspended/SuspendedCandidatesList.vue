<template>
  <div class="suspended-candidates-list">
    <h1 class="suspended-candidates-list__header">
      {{ $t('society-page.suspended-candidates-list.candidates-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="suspended-candidates-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="suspended-candidates-list__no-data"
          :message="
            $t('society-page.suspended-candidates-list.no-data-message')
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
  name: 'suspended-candidates-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.suspended-candidates-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
