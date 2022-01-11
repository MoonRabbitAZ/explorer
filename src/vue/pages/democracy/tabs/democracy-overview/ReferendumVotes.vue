<template>
  <div class="referendum-votes">
    <div class="referendum-votes__body">
      <value-displayer
        class="referendum-votes__value-displayer"
        :header="$t('democracy-page.referendum-votes.turnout-header')"
        :value="turnoutPercent"
        :value-level="1"
      />

      <value-displayer
        class="referendum-votes__value-displayer"
        :header="$t('democracy-page.referendum-votes.aye-header', {
          percent: ayePercent,
        })"
        :value="$fbalance(referendum.votedAye)"
        :tooltip="$fFullBalance(referendum.votedAye)"
        :value-level="1"
      />

      <value-displayer
        class="referendum-votes__value-displayer"
        :header="$t('democracy-page.referendum-votes.nay-header', {
          percent: nayPercent,
        })"
        :value="$fbalance(referendum.votedNay)"
        :tooltip="$fFullBalance(referendum.votedNay)"
        :value-level="1"
      />
    </div>

    <referendum-votes-expander
      class="referendum-votes__ferendum-votes-expander"
      :votes="referendum.allAye"
      :scrolled-element="scrolledElement"
    />

    <referendum-votes-expander
      class="referendum-votes__ferendum-votes-expander"
      :votes="referendum.allNay"
      :scrolled-element="scrolledElement"
      is-nay
    />
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import ReferendumVotesExpander from '@democracy-page/tabs/democracy-overview/ReferendumVotesExpander'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { BN_ZERO } from '@polkadot/util'

export default {
  name: 'referendum-votes',

  components: {
    ValueDisplayer,
    ReferendumVotesExpander,
  },

  props: {
    referendum: { type: Object, required: true },
    /** @type {HTMLElement} Element that will scroll  */
    scrolledElement: { type: Object, default: null },
  },

  setup (props) {
    const totalIssuance = useCall(api.query.balances?.totalIssuance)

    const ayePercent = computed(() => {
      const aye = props.referendum.allAye
        .reduce((total, { balance }) => total.add(balance), BN_ZERO)
      const votedTotal = props.referendum.votedTotal
      return votedTotal.isZero()
        ? '0%'
        : `${(aye.muln(10000).div(votedTotal).toNumber() / 100).toFixed(2)}%`
    })

    const nayPercent = computed(() => {
      const nay = props.referendum.allNay
        .reduce((total, { balance }) => total.add(balance), BN_ZERO)
      const votedTotal = props.referendum.votedTotal
      return votedTotal.isZero()
        ? '0%'
        : `${(nay.muln(10000).div(votedTotal).toNumber() / 100).toFixed(2)}%`
    })

    const turnoutPercent = computed(() => {
      if (!totalIssuance.value) return null

      const votedTotal = props.referendum.votedTotal
      return `${((votedTotal.muln(10000).div(totalIssuance.value).toNumber()) / 100).toFixed(2)}%`
    })

    return {
      ayePercent,
      nayPercent,
      turnoutPercent,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendum-votes__body {
  padding: 0 $drawer-padding;
}

.referendum-votes__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

.referendum-votes__ferendum-votes-expander {
  margin-top: 4rem;

  & + & {
    margin-top: 3rem;
  }
}
</style>
