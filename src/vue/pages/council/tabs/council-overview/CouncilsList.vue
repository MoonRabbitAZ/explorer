<template>
  <div class="councils-list">
    <div
      class="councils-list__headers"
      :class="{
        'councils-list__headers--grid': isHeaderDisplay
      }"
    >
      <h1 class="councils-list__header">
        {{ listHeaderTranslation }}
      </h1>
      <template v-if="isHeaderDisplay">
        <h4>
          {{ $t('council-page.councils-list.backing-header') }}
        </h4>
        <h4>
          {{ $t('council-page.councils-list.votes-header') }}
        </h4>
      </template>
    </div>
    <template v-if="isLoaded">
      <template
        v-if="elections.members.length
          && electionsListType === ELECTIONS_LIST_TYPE.members"
      >
        <div class="councils-list__body">
          <template
            v-for="([accountId, balance]) in elections.members"
            :key="accountId.toString()"
          >
            <council-row
              class="councils-list__row"
              :account-id="accountId.toString()"
              :balance="balance"
              :is-prime="prime?.eq(accountId)"
              :voters-count="allVotes[accountId.toString()]?.length"
              :elections-list-type="electionsListType"
              @openInfo="openInfo"
            />
          </template>
        </div>
      </template>
      <template
        v-else-if="elections.candidates.length
          && electionsListType === ELECTIONS_LIST_TYPE.candidates"
      >
        <div class="councils-list__body councils-list__body--candidates">
          <template
            v-for="(accountId) in elections.candidates"
            :key="accountId.toString()"
          >
            <div class="councils-list__candidates-row">
              <account-address
                :account-address="accountId.toString()"
              />
            </div>
          </template>
        </div>
      </template>
      <template
        v-else-if="elections.runnersUp.length
          && electionsListType === ELECTIONS_LIST_TYPE.runnersUp"
      >
        <div class="councils-list__body">
          <template
            v-for="([accountId, balance]) in elections.runnersUp"
            :key="accountId.toString()"
          >
            <council-row
              class="councils-list__row"
              :account-id="accountId.toString()"
              :balance="balance"
              :voters-count="allVotes[accountId.toString()]?.length"
              :elections-list-type="electionsListType"
              @openInfo="openInfo"
            />
          </template>
        </div>
      </template>
      <template v-else>
        <no-data-message
          class="councils-list__no-data"
          :message="$t('council-page.councils-list.members-no-data-message')"
          is-row-block
        />
      </template>
    </template>
    <template v-else>
      <skeleton-loader />
    </template>

    <drawer
      class="councils-list__info-drawer"
      v-model:is-shown="isInfoOpen"
      is-default-body
    >
      <template #heading>
        {{ drawerHeaderTranslation }}
      </template>
      <council-info
        :account-id="currentElection.accountId"
        :balance="currentElection.balance"
        :is-prime="prime?.eq(currentElection.accountId)"
      />
    </drawer>
  </div>
</template>

<script>
import CouncilRow from '@council-page/tabs/council-overview/CouncilRow'
import CouncilInfo from '@council-page/tabs/council-overview/CouncilInfo'
import Drawer from '@/vue/common/Drawer'
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import AccountAddress from '@/vue/common/AccountAddress'

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { oneOf } from '@/js/helpers/type-validators'

const ELECTIONS_LIST_TYPE = {
  members: 'members',
  runnersUp: 'runnersUp',
  candidates: 'candidates',
}
export default {
  name: 'councils-list',

  components: {
    Drawer,
    SkeletonLoader,
    NoDataMessage,
    CouncilRow,
    AccountAddress,
    CouncilInfo,
  },

  props: {
    elections: { type: Object, default: null },
    prime: { type: Object, default: null },
    allVotes: { type: Object, default: null },
    electionsListType: {
      type: String,
      required: true,
      validator: oneOf(ELECTIONS_LIST_TYPE),
    },
  },

  setup (props) {
    const { t } = useI18n()
    const currentAccountId = ref('')
    const isInfoOpen = ref(false)

    const drawerHeaderTranslation = computed(() => {
      let translation
      switch (props.electionsListType) {
        case ELECTIONS_LIST_TYPE.members:
          translation = t('council-page.councils-list.drawer-header-member')
          break
        case ELECTIONS_LIST_TYPE.runnersUp:
          translation = t('council-page.councils-list.drawer-header-runner-up')
          break
      }

      return translation
    })

    const isLoaded = computed(() =>
      Boolean(props.elections && props.allVotes),
    )

    const isHeaderDisplay = computed(() => {
      let isLength = false
      if (isLoaded.value) {
        switch (props.electionsListType) {
          case ELECTIONS_LIST_TYPE.members:
            isLength = Boolean(props.elections.members.length)
            break
          case ELECTIONS_LIST_TYPE.runnersUp:
            isLength = Boolean(props.elections.runnersUp.length)
            break
          case ELECTIONS_LIST_TYPE.candidates:
            isLength = Boolean(props.elections.candidates.length)
            break
        }
      }

      return isLoaded.value && isLength
    })

    const listHeaderTranslation = computed(() => {
      let translation
      switch (props.electionsListType) {
        case ELECTIONS_LIST_TYPE.members:
          translation = t('council-page.councils-list.header-members')
          break
        case ELECTIONS_LIST_TYPE.runnersUp:
          translation = t('council-page.councils-list.header-runners-up')
          break
        case ELECTIONS_LIST_TYPE.candidates:
          translation = t('council-page.councils-list.header-candidates')
          break
      }

      return translation
    })

    const currentElection = computed(() => {
      let accountId = ''
      let balance = null

      if (props.elections) {
        switch (props.electionsListType) {
          case ELECTIONS_LIST_TYPE.members: {
            const [accId, bal] = props.elections.members.find(([accountId]) =>
              currentAccountId.value === accountId.toString(),
            )
            if (accId) {
              accountId = currentAccountId.value
              balance = bal
            }
            break
          }
          case ELECTIONS_LIST_TYPE.runnersUp: {
            const [accId, bal] = props.elections.runnersUp.find(([accountId]) =>
              currentAccountId.value === accountId.toString(),
            )
            if (accId) {
              accountId = currentAccountId.value
              balance = bal
            }
            break
          }
        }
      }

      return {
        accountId,
        balance,
      }
    })

    function openInfo (accountId) {
      currentAccountId.value = accountId
      isInfoOpen.value = true
    }

    return {
      isLoaded,
      isHeaderDisplay,
      drawerHeaderTranslation,
      currentElection,
      isInfoOpen,
      openInfo,
      listHeaderTranslation,
      ELECTIONS_LIST_TYPE,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.councils-list__headers {
  margin-bottom: 2rem;
  padding: 0 1.6rem;

  &--grid {
    @include councils-grid-row(flex-end);
  }
}

.councils-list__body {
  max-height: 50vh;
  overflow-y: auto;

  @include scrollbar;

  &--candidates {
    max-height: 100vh;
  }
}

.councils-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

.councils-list__candidates-row {
  padding: 1rem 1.6rem;

  @include content-block;
}

</style>
