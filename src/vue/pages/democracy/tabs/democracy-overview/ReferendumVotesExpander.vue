<template>
  <expander
    class="referendum-votes-expander"
    :title="title"
    is-in-drawer
  >
    <template #secondary>
      <div class="referendum-votes-expander__vote">
        <template
          v-for="(vote, index) in votes"
          :key="index"
        >
          <account-address
            class="referendum-votes-expander__address"
            :account-address="vote.accountId.toString()"
          />
          <div class="referendum-votes-expander__balance">
            <p
              v-tooltip="$fFullBalance(vote.balance)"
              class="referendum-votes-expander__balance-amount"
            >
              {{ $fbalance(vote.balance) }}
            </p>
            <p class="referendum-votes-expander__conviction">
              {{ voteLabel(vote.vote.conviction, vote.isDelegating) }}
            </p>
          </div>
        </template>
      </div>
    </template>
  </expander>
</template>

<script>
import Expander from '@/vue/common/Expander'
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const SIZING = ['0.1x', '1x', '2x', '3x', '4x', '5x', '6x']

export default {
  name: 'referendum-votes-expander',

  components: {
    Expander,
    AccountAddress,
  },

  props: {
    votes: { type: Object, required: true },
    isNay: { type: Boolean, default: false },
  },

  setup (props) {
    const { t } = useI18n()

    const title = computed(() =>
      props.isNay
        ? t('democracy-page.referendum-votes-expander.nays-header', {
          count: props.votes.length,
        })
        : t('democracy-page.referendum-votes-expander.ayes-header', {
          count: props.votes.length,
        }),
    )

    function voteLabel (conviction, isDelegating) {
      return `${SIZING[conviction.toNumber()]}${isDelegating ? '/d' : ''}`
    }

    return {
      voteLabel,
      title,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendum-votes-expander__vote {
  display: grid;
  grid-gap: 1.6rem 0.4rem;
  grid-template-columns: repeat(2, 1fr);
}

.referendum-votes-expander__balance {
  justify-self: end;
}

.referendum-votes-expander__balance-amount {
  width: max-content;
}

.referendum-votes-expander__conviction {
  text-align: right;
}
</style>
