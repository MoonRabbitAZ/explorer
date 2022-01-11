<template>
  <div class="external-row">
    <div>
      <proposal-cell
        class="external-row__proposals"
        :image-hash="external.imageHash"
        :proposal="external.image?.proposal"
      />
    </div>
    <div>
      <template v-if="external.image">
        <account-address
          :account-address="external.image.proposer.toString()"
        />
      </template>
    </div>
    <p>
      <template v-if="external.image">
        {{ $fbalance(external.balance) }}
      </template>
    </p>
  </div>
</template>

<script>
import ProposalCell from '@council-page/tabs/motions/ProposalCell'
import AccountAddress from '@/vue/common/AccountAddress'

export default {
  name: 'external-row',

  components: { ProposalCell, AccountAddress },

  props: {
    external: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.external-row {
  min-width: min-content;

  @include democracy-external-grid-row(center, 1rem);
  @include content-block;
}
</style>
