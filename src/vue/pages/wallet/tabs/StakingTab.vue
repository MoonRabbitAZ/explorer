<template>
  <div class="staking-tab app__padding">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="$t('error-header')"
          :message="$t('error-message')"
        />
      </template>
      <template v-else>
        <div class="staking-tab__top-bar">
          <app-button
            class="my-accounts-tab__actions-button"
            scheme="primary"
            :text="$t('stake-btn')"
            @click="isStakeFormOpen = true"
          />
        </div>

        <staking-list :staking-list="stakingList"/>

        <drawer
          v-model:is-shown="isStakeFormOpen"
          is-default-body
          :close-by-click-outside="false"
        >
          <template #heading>
            {{ $t('stake-title') }}
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
      myAccounts: null,
      isStakeFormOpen: false,
      stakingOptions: [],
      isLoadFailed: false,
      isLoaded: false,
    })

    keyring.accounts.subject.subscribe(async (accounts) => {
      try {
        const addresses = accounts ? Object.keys(accounts) : []
        state.myAccounts = addresses.map(address => keyring.getAccount(address))

        const stakings = await Promise.all(
          addresses.map(async (address) =>
            stakingApi.get(`api/staking/${address}`, {
              page: {
                limit: 100,
              },
            }),
          ))
        const options = await stakingApi.get('api/options')

        state.stakingOptions =
          options.data.map(i => new StakingOptionRecord(i))

        state.stakingList = stakings.map(({ data }) => data)
          .flat()
          .map(i => new StakingRecord(i))
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.process(e)
      }

      state.isLoaded = true
    })

    return {
      ...toRefs(state),
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
    "error-header": "Error",
    "error-message": "There was an error while loading.",
  }
}
</i18n>
