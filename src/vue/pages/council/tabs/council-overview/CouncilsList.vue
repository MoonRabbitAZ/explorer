<template>
  <div class="councils-list">
    <h1 class="councils-list__header">
      {{ $t('council-page.councils-list.council-header') }}
    </h1>
    <template v-if="true">
      <template v-if="false">
        <div class="councils-list__body"/>
      </template>
      <template v-else>
        <no-data-message
          class="councils-list__no-data"
          :message="$t('council-page.councils-list.no-data-message')"
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

import { oneOf } from '@/js/helpers/type-validators'

const ELECTIONS_LIST_TYPE = {
  runnersUp: 'runnersUp',
  candidates: 'candidates',
  members: 'members',
}
export default {
  name: 'councils-list',

  components: {
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    elections: { type: Object, default: null },
    electionsListType: {
      type: String,
      required: true,
      validator: oneOf(ELECTIONS_LIST_TYPE),
    },
  },

  setup () {
    // const list =
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.councils-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

</style>
