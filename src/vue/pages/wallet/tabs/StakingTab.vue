<template>
  <div class="staking-tab">
    <template v-if="isLoaded && isLoadedStaking">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('wallet-page.staking-tab.error-header')"
          :message="$t('wallet-page.staking-tab.error-message')"
        />
      </template>
      <template v-else>
        <div class="staking-tab__top-bar">
          <app-button
            class="my-accounts-tab__actions-button"
            scheme="primary"
            :text="$t('wallet-page.staking-tab.stake-btn')"
            @click="isStakeFormOpen = true"
          />
        </div>

        <staking-list
          :staking-list="stakingList"
          @withdrawn="getStakings"
        />

        <drawer
          v-model:is-shown="isStakeFormOpen"
          is-default-body
          :close-by-click-outside="false"
        >
          <template #heading>
            {{ $t('wallet-page.staking-tab.stake-title') }}
          </template>
          <staking-form
            :my-accounts="myAccounts"
            :staking-options="stakingOptions"
            @close-drawer="isStakeFormOpen = false"
          />
        </drawer>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import StakingList from '@wallet-page/tabs/staking-tab/StakingList'
import StakingForm from '@/vue/forms/StakingForm'
import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { reactive, toRefs } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
import { StakingRecord } from '@/js/records/staking.record'
import { stakingApi } from '@api'
import { StakingOptionRecord } from '@/js/records/staking-option.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { STAKING_STATUSES } from '@/js/const/staking.const'

export default {
  name: 'staking-tab',

  components: {
    StakingList,
    StakingForm,
    Drawer,
    Loader,
    ErrorMessage,
  },

  setup () {
    const state = reactive({
      stakingList: [],
      addresses: null,
      myAccounts: null,
      isStakeFormOpen: false,
      stakingOptions: [],
      isLoadFailed: false,
      isLoaded: false,
      isLoadedStaking: false,
    })

    async function getStakings () {
      state.isLoadedStaking = false
      state.isLoadFailed = false
      try {
        const stakings = await Promise.all(
          state.addresses.map(async (address) =>
            stakingApi.get(`api/staking/${address}`, {
              page: {
                order: 'desc',
                limit: 100,
              },
              filter: {
                status: `${STAKING_STATUSES.pending},${STAKING_STATUSES.active},${STAKING_STATUSES.withdrawable}`,
              },
            }),
          ))

        state.stakingList = stakings.map(({ data }) => data)
          .flat()
          .map(i => new StakingRecord(i))
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }

      state.isLoadedStaking = true
    }

    async function getStakingsOptions () {
      const options = await stakingApi.get('api/options')

      state.stakingOptions =
          options.data.map(i => new StakingOptionRecord(i))
    }

    keyring.accounts.subject.subscribe(async (accounts) => {
      try {
        state.addresses = accounts ? Object.keys(accounts) : []
        state.myAccounts =
          state.addresses.map(address => keyring.getAccount(address))

        await Promise.all([
          getStakings(),
          getStakingsOptions(),
        ])
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }

      state.isLoaded = true
    })

    return {
      ...toRefs(state),
      getStakings,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.staking-tab { @include app-padding; }

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
