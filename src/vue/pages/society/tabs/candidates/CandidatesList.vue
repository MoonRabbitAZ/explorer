<template>
  <div class="candidates-list">
    <h1 class="candidates-list__header">
      {{ $t('society-page.candidates-list.candidates-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="candidates-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="candidates-list__no-data"
          :message="$t('society-page.candidates-list.no-data-message')"
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
  name: 'candidates-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.candidates-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
