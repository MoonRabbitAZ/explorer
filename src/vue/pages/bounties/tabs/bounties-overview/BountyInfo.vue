<template>
  <div class="bounty-info">
    <div class="bounty-info__account-block">
      <h3 class="bounty-info__header">
        {{ $t('bounties-page.bounty-info.proposer-header') }}
      </h3>
      <div class="bounty-info__account">
        <account-address
          :account-address="bounty.proposer.toString()"
          icon-size="big"
        />
      </div>
    </div>

    <div
      v-if="curatorToRender"
      class="bounty-info__account-block"
    >
      <h3 class="bounty-info__header">
        {{ $t('bounties-page.bounty-info.curator-header') }}
      </h3>
      <div class="bounty-info__account">
        <account-address
          :account-address="curatorToRender.toString()"
          icon-size="big"
        />
      </div>
    </div>

    <div class="bounty-info__body">
      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.index-header')"
        :value="$fnumber(index)"
        :value-level="1"
      />

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.status-header')"
        :value="bountyState.bountyStatus"
        is-full-value
      />

      <value-displayer
        v-if="blockNextAction"
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.next-action-header')"
        :value="nextActionTime"
      >
        <p class="bounty-info__next-action-value">
          {{ nextActionTime }}
        </p>
        <p class="bounty-info__next-action-value">
          {{ `#${$fnumber(blockNextAction)}` }}
        </p>
      </value-displayer>

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.value-header')"
        :value="$fbalance(bounty.value)"
        :tooltip="$fFullBalance(bounty.value)"
      />

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.bond-header')"
        :value="$fbalance(bounty.bond)"
        :tooltip="$fFullBalance(bounty.bond)"
      />

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.curator-fee-header')"
        :value="bountyState.curator ? $fbalance(bounty.fee) : '-'"
        :tooltip="bountyState.curator && $fFullBalance(bounty.fee)"
      />

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.curator-deposit-header')"
        :value="bountyState.curator ? $fbalance(bounty.curatorDeposit) : '-'"
        :tooltip="bountyState.curator && $fFullBalance(bounty.curatorDeposit)"
      />

      <value-displayer
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.description-header')"
        :value="description"
        :value-level="4"
        is-full-value
      />

      <value-displayer
        v-if="proposal && members"
        class="bounty-info__value-displayer"
        :header="$t('bounties-page.bounty-info.votes-header')"
        :value="ayesVotes && naysVotes"
      >
        <p class="bounty-info__next-action-value">
          {{ $t('bounties-page.bounty-info.aye-value', {
            count: `${ayesVotes}/${threshold}`
          }) }}
        </p>
        <p class="bounty-info__next-action-value">
          {{ $t('bounties-page.bounty-info.nay-value', {
            count: `${naysVotes}/${nayThreshold}`
          }) }}
        </p>
      </value-displayer>
    </div>

    <expander
      v-if="proposal"
      class="bounty-info__expander"
      :title="$t('bounties-page.bounty-info.ayes-expander-header', {
        count: ayesVotes
      })"
      is-in-drawer
    >
      <template #secondary>
        <account-address
          v-for="(account, index) in proposal.votes.ayes"
          :key="index"
          class="bounty-info__address"
          :account-address="account.toString()"
        />
      </template>
    </expander>

    <expander
      v-if="proposal"
      class="bounty-info__expander"
      :title="$t('bounties-page.bounty-info.nays-expander-header', {
        count: naysVotes
      })"
      is-in-drawer
    >
      <template #secondary>
        <account-address
          v-for="(account, index) in proposal.votes.nays"
          :key="index"
          class="bounty-info__address"
          :account-address="account.toString()"
        />
      </template>
    </expander>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import Expander from '@/vue/common/Expander'

import { computed } from 'vue'
import { useCollectiveMembers } from '@/vue/composables'
import { useBounty } from '@bounties-page/composables/useBounty'
import { getProposalToDisplay } from '@/js/helpers/extendedProposal'
import { BN } from '@polkadot/util'

const BOUNTY_METHOD_PROPOSE_CURATOR = 'proposeCurator'

export default {
  name: 'bounty-info',

  components: {
    ValueDisplayer,
    Expander,
    AccountAddress,
  },

  props: {
    /** @type {import('@polkadot/types/interfaces').Bounty}  */
    bounty: { type: Object, required: true },
    /** @type {import('@polkadot/api-derive/types').DeriveCollectiveProposal[]}  */
    proposals: { type: Array, required: true },
    index: { type: BN, required: true },
    description: { type: String, required: true },
    bestNumber: { type: BN, default: null },
  },

  setup (props) {
    const { members } = useCollectiveMembers('council')
    const bountyStatus = computed(() => props.bounty.status)
    const bestNumber = computed(() => props.bestNumber)
    const {
      bountyState,
      nextActionTime,
      blockNextAction,
    } = useBounty(bountyStatus, bestNumber)

    const proposal = computed(() => {
      if (!props.proposals) return
      return getProposalToDisplay(props.proposals, bountyStatus.value)
    })

    const naysVotes = computed(() => proposal.value?.votes?.nays.length)
    const ayesVotes = computed(() => proposal.value?.votes?.ayes.length)
    const threshold = computed(() =>
      proposal.value?.votes?.threshold.toNumber(),
    )
    const nayThreshold = computed(() =>
      members.value?.length && threshold.value
        ? members.value.length - threshold.value + 1
        : 0,
    )

    const curatorToRender = computed(() => {
      if (bountyState.value.curator) {
        return bountyState.value.curator
      }

      return proposal.value?.proposal.method === BOUNTY_METHOD_PROPOSE_CURATOR
        ? proposal.value.proposal.args[1]
        : null
    })

    return {
      members,
      bountyState,
      nextActionTime,
      blockNextAction,
      proposal,
      ayesVotes,
      naysVotes,
      threshold,
      nayThreshold,
      curatorToRender,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bounty-info__account-block {
  & + & {
    margin-top: 3rem;
  }
}

.bounty-info__header {
  margin-bottom: 1rem;
  padding: 0 $drawer-padding;
  color: $col-app-header-secondary;
}

.bounty-info__account {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.bounty-info__body {
  margin-top: 4rem;
  padding: 0 $drawer-padding;
}

.bounty-info__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

.bounty-info__next-action-value {
  font-size: inherit;

  & + & {
    margin-top: 1rem;
  }
}

.bounty-info__expander {
  margin-top: 4rem;

  & + & {
    margin-top: 3rem;
  }
}
</style>
