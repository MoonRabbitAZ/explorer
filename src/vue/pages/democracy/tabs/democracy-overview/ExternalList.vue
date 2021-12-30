<template>
  <div class="external-list">
    <div
      class="external-list__headers"
      :class="{'external-list__headers--grid': external}"
    >
      <h1>
        {{ $t('democracy-page.external-list.external-header') }}
      </h1>
      <template v-if="external">
        <h4>
          {{ $t('democracy-page.external-list.proposer-header') }}
        </h4>
        <h4>
          {{ $t('democracy-page.external-list.locked-header') }}
        </h4>
      </template>
    </div>
    <template v-if="external !== undefined">
      <template v-if="external !== null">
        <external-row :external="external"/>
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
import ExternalRow from '@democracy-page/tabs/democracy-overview/ExternalRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { useCall } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'external-list',

  components: {
    ExternalRow,
    SkeletonLoader,
    NoDataMessage,
  },

  setup () {
    const external = useCall(api.derive.democracy.nextExternal)

    return { external }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.external-list {
  overflow-x: auto;

  @include scrollbar;
}

.external-list__headers {
  margin-bottom: 2rem;

  &--grid {
    @include democracy-external-grid-row(flex-end);
  }
}
</style>
