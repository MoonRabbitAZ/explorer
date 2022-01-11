<template>
  <div class="fund-info">
    <div class="fund-info__accent-block">
      <h3 class="fund-info__header">
        {{ $t('parachains-page.fund-info.depositor-header') }}
      </h3>
      <div class="fund-info__depositor">
        <account-address-row
          :account-address="fund.info.depositor.toString()"
          icon-size="big"
        />
      </div>
    </div>

    <div
      v-if="isCanContribute || isCanWithdraw || isCanDissolve"
      class="fund-info__actions"
    >
      <app-button
        v-if="isCanContribute"
        class="fund-info__actions-btn"
        size="big"
        scheme="primary"
        :text="$t('parachains-page.fund-info.contribute-btn')"
        disabled
      />

      <app-button
        v-if="isCanWithdraw"
        class="fund-info__actions-btn"
        size="big"
        scheme="secondary"
        :text="$t('parachains-page.fund-info.refund-btn')"
        disabled
      />

      <app-button
        v-if="isCanDissolve"
        class="fund-info__actions-btn"
        size="big"
        scheme="secondary"
        :text="dissolveButtonText"
        disabled
      />
    </div>
    <div class="fund-info__body">
      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.para-id-header')"
        :value="$fnumber(fund.paraId)"
        :value-level="1"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.status-header')"
        :value="fundStatus"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.ending-header')"
        :value="fund.info.end.toString()"
      >
        <p class="fund-info__value">
          {{ `#${$fnumber(fund.info.end)}` }}
        </p>
        <template v-if="isOngoing">
          <p class="fund-info__value">
            {{ blocksLeftTime }}
          </p>
        </template>
      </value-displayer>

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.leases-header')"
        :value="period"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.raised-header')"
        :value="`${$fbalance(fund.info.raised)} (${raisedProgress})`"
        :tooltip="$fFullBalance(fund.info.raised)"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.cap-header')"
        :value="$fbalance(fund.info.cap)"
        :tooltip="$fFullBalance(fund.info.cap)"
      />

      <value-displayer
        class="fund-info__value-displayer"
        :header="$t('parachains-page.fund-info.all-contributors-header')"
        :value="derive?.contributorsHex?.length"
      />
    </div>
    <my-contributors-expander
      :contributors="myContributionsWithBalance"
    />
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import AccountAddressRow from '@/vue/common/AccountAddressRow'
import MyContributorsExpander from '@parachains-page/tabs/crowdloan/MyContributorsExpander'

import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { BN } from '@polkadot/util'
import { useFundInfo } from '@parachains-page/composables/useFundInfo'
import { useContributions } from '@parachains-page/composables/useContributions'
import { FundRecord } from '@/js/records/fund.record'
import { LeasePeriodRecord } from '@/js/records/lease-period.record'

export default {
  name: 'fund-info',

  components: { ValueDisplayer, AccountAddressRow, MyContributorsExpander },

  props: {
    fund: { type: FundRecord, required: true },
    bestNumber: { type: BN, default: null },
    leasePeriod: { type: LeasePeriodRecord, default: null },
    isOngoing: { type: Boolean, default: false },
  },

  setup (props) {
    const { t } = useI18n()
    const { bestNumber, fund, isOngoing, leasePeriod } = toRefs(props)
    const {
      fundStatus,
      period,
      blocksLeftTime,
      blocksLeft,
      raisedProgress,
    } = useFundInfo(fund, bestNumber, isOngoing.value)

    const {
      derive,
      myAccounts,
      myContributions,
      myAccountsHex,
    } = useContributions(fund.value.paraId)

    const isHasEnded = computed(() =>
      !blocksLeft.value && Boolean(leasePeriod.value) && (
        fund.value.isWinner
          ? leasePeriod.value.currentPeriod.gt(fund.value.info.lastPeriod)
          : leasePeriod.value.currentPeriod.gt(fund.value.info.firstPeriod)
      ),
    )

    const isCanDissolve = computed(() => {
      const currentFund = fund.value.info.raised
      return currentFund.isZero()
    })

    const isCanWithdraw = !isCanDissolve.value && isHasEnded.value

    const isCanContribute = computed(() =>
      props.isOngoing && !fund.value.isCapped &&
        !fund.value.isWinner && Boolean(blocksLeft.value),
    )

    const dissolveButtonText = computed(() => {
      return fund.value.isEnded
        ? t('parachains-page.fund-info.close-btn')
        : t('parachains-page.fund-info.cancel-btn')
    })

    const myContributionsWithBalance = computed(() => {
      return myContributions.value && myAccountsHex.value?.length
        ? myAccounts.value.map((item, index) => ({
          contribution: myContributions.value[myAccountsHex.value[index]],
          accountAddress: item,
        }))
        : []
    })

    return {
      fundStatus,
      period,
      blocksLeftTime,
      blocksLeft,
      raisedProgress,
      derive,
      myAccounts,
      myContributions,
      myContributionsWithBalance,
      dissolveButtonText,
      isCanDissolve,
      isCanContribute,
      isCanWithdraw,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.fund-info__body {
  padding: 0 $drawer-padding;
  margin-top: 4rem;
}

.fund-info__actions {
  padding: 0 $drawer-padding;
  margin-top: 4rem;
}

.fund-info__actions-btn {
  width: 100%;

  & + & {
    margin-top: 3rem;
  }
}

.fund-info__header {
  margin-bottom: 1rem;
  padding: 0 $drawer-padding;
  color: $col-app-header-secondary;
}

.fund-info__depositor {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.fund-info__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

.fund-info__value {
  font-size: inherit;

  & + & {
    margin-top: 1rem;
  }
}
</style>
