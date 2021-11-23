<template>
  <div class="staking-account-row">
    <account-address
      is-name-display
      :account-address="staking.address"
    />
    <p
      v-tooltip="staking.isStatusPending ? '' : $fFullBalance(staking.amount)"
      class="staking-account-row__column"
    >
      <template v-if="staking.isStatusPending">
        {{ $t('wallet-page.staking-account-row.status-pending') }}
      </template>
      <template v-else>
        {{ $fbalance(staking.amount) }}
      </template>
    </p>
    <p class="staking-account-row__column">
      <span
        v-if="staking.resultAmount"
        v-tooltip="$fFullBalance(staking.resultAmount)"
      >
        {{ $fbalance(staking.resultAmount) }}
      </span>
    </p>
    <p class="staking-account-row__column">
      {{ $t(`staking-options.types.type-${staking.stakeOptionId}`, {
        percent: staking.rewardPercent
      }) }}
    </p>
    <p class="staking-account-row__column">
      {{ `${$fddmy(staking.createdAt)}-${$fddmy(staking.lockedUntil)}` }}
    </p>
    <div>
      <app-button
        scheme="secondary"
        :text="$t('wallet-page.staking-account-row.unstake-btn')"
        :disabled="isUnstakeButtonDisable"
        @click="unstake"
      />
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { stakingApi } from '@api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { StakingRecord } from '@/js/records/staking.record'

const EVENTS = {
  withdrawn: 'withdrawn',

  // For disable all button on the staking list until the end of the process
  updateIsProcessingUnstake: 'update:is-processing-unstake',
}

export default {
  name: 'staking-account-row',

  components: { AccountAddress },

  props: {
    staking: { type: StakingRecord, required: true },
    isProcessingUnstake: { type: Boolean, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const isUnstakeButtonDisable = computed(() => {
      return !props.staking.isStatusWithdrawable || props.isProcessingUnstake
    })

    async function unstake () {
      emit(EVENTS.updateIsProcessingUnstake, true)
      try {
        Bus.processing('wallet-page.staking-account-row.processing-unstake-msg')
        await stakingApi.patch(`api/staking/details/${props.staking.id}/withdraw`)

        Bus.success('wallet-page.staking-account-row.success-unstake-msg')
        emit(EVENTS.withdrawn)
      } catch (e) {
        ErrorHandler.process(e)
      }
      emit(EVENTS.updateIsProcessingUnstake, false)
    }

    return { unstake, isUnstakeButtonDisable }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-account-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: minmax(15rem, 1fr)
    repeat(2, minmax(10rem, 0.5fr)) 20rem 15rem max-content;
  align-items: center;
  padding: 1rem 1.6rem;
  min-width: min-content;

  @include content-block;
}

.staking-account-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
