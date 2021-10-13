<template>
  <div class="proposals-list">
    <h1 class="proposals-list__header">
      {{ $t('democracy-page.proposals-list.proposals-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="proposals-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="proposals-list__no-data"
          :message="$t('democracy-page.proposals-list.no-data-message')"
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
  name: 'proposals-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposals-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
