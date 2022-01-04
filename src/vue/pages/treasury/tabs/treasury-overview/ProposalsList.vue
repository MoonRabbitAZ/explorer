<template>
  <div class="proposals-list">
    <div
      class="proposals-list__headers"
      :class="{'proposals-list__headers--grid': proposals?.length}"
    >
      <h1>
        {{ mainHeader }}
      </h1>
      <template v-if="proposals?.length">
        <h4>
          {{ $t('treasury-page.proposals-list.beneficiary-header') }}
        </h4>
        <h4>
          {{ $t('treasury-page.proposals-list.payment-header') }}
        </h4>
        <h4>
          {{ $t('treasury-page.proposals-list.bond-header') }}
        </h4>
      </template>
    </div>
    <template v-if="proposals">
      <template v-if="proposals.length">
        <proposal-row
          v-for="(proposal, index) in proposals"
          :key="index"
          :proposal="proposal"
        />
      </template>
      <template v-else>
        <no-data-message
          class="proposals-list__no-data"
          :message="noDataMessage"
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
import ProposalRow from '@treasury-page/tabs/treasury-overview/ProposalRow'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'proposals-list',

  components: {
    ProposalRow,
    SkeletonLoader,
    NoDataMessage,
  },

  props: {
    proposals: { type: Array, default: null },
    isApproved: { type: Boolean, decimals: false },
  },

  setup (props) {
    const { t } = useI18n()

    const mainHeader = computed(() =>
      props.isApproved
        ? t('treasury-page.proposals-list.approved-header')
        : t('treasury-page.proposals-list.proposals-header'),
    )

    const noDataMessage = computed(() =>
      props.isApproved
        ? t('treasury-page.proposals-list.no-data-message-approved')
        : t('treasury-page.proposals-list.no-data-message-proposal'),
    )

    return { mainHeader, noDataMessage }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.proposals-list {
  overflow-x: auto;

  @include scrollbar;
}

.proposals-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    & > :first-child {
      grid-column: 1/3;
    }

    @include treasury-proposal-grid-row(flex-end);
  }
}
</style>
