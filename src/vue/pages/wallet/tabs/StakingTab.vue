<template>
  <div class="staking-tab app__padding">
    <div class="staking-tab__top-bar">
      <app-button
        class="my-accounts-tab__actions-button"
        scheme="primary"
        :text="$t('stake-btn')"
        @click="isStakeFormOpen = true"
      />
    </div>

    <staking-list :staking-list="accountsStakingList"/>

    <drawer
      v-model:is-shown="isStakeFormOpen"
      is-default-body
      :close-by-click-outside="false"
    >
      <template #heading>
        {{ $t('stake-title') }}
      </template>
      <staking-form
        :my-accounts="allAccounts"
        :staking-options="stakingOptions"
        @close-drawer="isStakeFormOpen = false"
      />
    </drawer>
  </div>
</template>

<script>
import StakingList from '@wallet-page/tabs/staking-tab/StakingList'
import StakingForm from '@/vue/forms/StakingForm'
import Drawer from '@/vue/common/Drawer'

import { ref } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
import { StakingRecord } from '@/js/records/staking.record'
import { stakingApi } from '@api'
import { StakingOptionRecord } from '@/js/records/staking-option.record'

const HARDCODE_STAKING = [
  {
    address: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F',
    amount: '10000',
    interestRate: '20',
    createdAt: 1632122308000,
  },
  {
    address: 'DE14BzQ1bDXWPKeLoAqdLAm1GpyAWaWF1knF74cEZeomTBM',
    amount: '123456',
    interestRate: '12',
    createdAt: 1631101244000,

  },
  {
    address: 'GsvVmjr1CBHwQHw84pPHMDxgNY3iBLz6Qn7qS3CH8qPhrHz',
    amount: '99999999999',
    interestRate: '120',
    createdAt: 1632015723000,
  },
]

const address = 'GsvVmjr1CBHwQHw84pPHMDxgNY3iBLz6Qn7qS3CH8qPhrHz'

export default {
  name: 'staking-tab',

  components: {
    StakingList,
    StakingForm,
    Drawer,
  },

  setup () {
    const accountsStakingList = ref([])
    const allAccounts = ref()
    const isStakeFormOpen = ref(false)
    const stakingOptions = ref([])
    accountsStakingList.value = HARDCODE_STAKING.map(i => new StakingRecord(i))

    keyring.accounts.subject.subscribe(accounts => {
      const addresses = accounts ? Object.keys(accounts) : []
      allAccounts.value = addresses.map(address => keyring.getAccount(address))
    })

    async function init () {
      const { data } = await stakingApi.get('api/options')
      stakingOptions.value = data.map(i => new StakingOptionRecord(i))
    }

    init()

    return {
      accountsStakingList,
      isStakeFormOpen,
      address,
      allAccounts,
      stakingOptions,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-tab__top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
}

.staking-tab__header {
  margin-bottom: 2rem;
}

.staking-tab__row {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "stake-title": "Stake",
    "stake-btn": "Stake",
  }
}
</i18n>
