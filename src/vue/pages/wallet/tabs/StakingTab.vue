<template>
  <div class="staking-tab">
    <template v-if="isLoaded">
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
            :disabled="!stakingOptions.length"
            @click="isStakeFormOpen = true"
          />
        </div>

        <staking-list :addresses="addresses"/>

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

import { reactive, toRefs, onBeforeUnmount } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
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
      addresses: null,
      myAccounts: null,
      isStakeFormOpen: false,
      stakingOptions: [],
      subscriber: null,
      isLoadFailed: false,
      isLoaded: false,
    })

    async function getStakingsOptions () {
      const options = await stakingApi.get('api/options')

      state.stakingOptions = options.data.map(i => new StakingOptionRecord(i))
    }

    state.subscriber =
      keyring.accounts.subject.subscribe(async (accounts) => {
        try {
          state.addresses = accounts ? Object.keys(accounts) : []
          state.myAccounts =
            state.addresses.map(address => keyring.getAccount(address))

          await getStakingsOptions()
        } catch (e) {
          state.isLoadFailed = true
          ErrorHandler.processWithoutFeedback(e)
        }

        state.isLoaded = true
      })

    onBeforeUnmount(() => {
      if (state.subscriber) state.subscriber.unsubscribe()
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
