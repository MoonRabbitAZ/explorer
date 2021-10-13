<template>
  <div class="members-list">
    <h1 class="members-list__header">
      {{ $t('tech-comm-page.members-list.members-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="members-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="members-list__no-data"
          :message="$t('tech-comm-page.members-list.no-data-message')"
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
  name: 'members-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.members-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
