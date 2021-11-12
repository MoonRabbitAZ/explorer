<template>
  <div class="unfinished-flows-list">
    <div class="unfinished-flows-list__body">
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            :header="$t('bridge-page.unfinished-flows-list.error-header')"
            :message="$t('bridge-page.unfinished-flows-list.error-message')"
          />
        </template>
        <template v-else>
          <div class="unfinished-flows-list__headers">
            <h1 class="unfinished-flows-list__header">
              <!-- eslint-disable-next-line max-len -->
              {{ $t('bridge-page.unfinished-flows-list.unfinished-flows-header') }}
            </h1>
            <template v-if="unfinishedFlows.length">
              <h4 class="unfinished-flows-list__header">
                <!-- eslint-disable-next-line max-len -->
                {{ $t('bridge-page.unfinished-flows-list.amount-or-token-id-header') }}
              </h4>
              <h4 class="unfinished-flows-list__header">
                {{ $t('bridge-page.unfinished-flows-list.from-header') }}
              </h4>
              <h4 class="unfinished-flows-list__header">
                {{ $t('bridge-page.unfinished-flows-list.to-header') }}
              </h4>
              <h4
                class="
                  unfinished-flows-list__header
                  unfinished-flows-list__destination-header
                "
              >
                {{ $t('bridge-page.unfinished-flows-list.destination-header') }}
              </h4>
            </template>
          </div>
          <template v-if="unfinishedFlows.length">
            <div
              v-for="(unfinishedFlow, id) in unfinishedFlows"
              :key="id"
              class="unfinished-flows-list__row"
            >
              <p class="unfinished-flows-list__type">
                <!-- eslint-disable-next-line max-len -->
                {{ `${unfinishedFlow.token.originalType} / ${unfinishedFlow.token.internalType}` }}
              </p>
              <p class="unfinished-flows-list__amount">
                {{
                  unfinishedFlow.flow.tokenId ||
                    toExternalBalance(
                      unfinishedFlow.flow.amount,
                      unfinishedFlow.decimals,
                      unfinishedFlow.token.ticker,
                    )
                }}
              </p>
              <div class="unfinished-flows-list__chain">
                <p class="unfinished-flows-list__chain-token">
                  {{ unfinishedFlow.flow.ticker }}
                </p>
                <p class="unfinished-flows-list__chain-name">
                  {{ unfinishedFlow.flow.isTypeWithdraw
                    ? baseChain.name
                    : unfinishedFlow.chain.name
                  }}
                </p>
              </div>
              <div class="unfinished-flows-list__chain">
                <p class="unfinished-flows-list__chain-token">
                  {{ unfinishedFlow.flow.ticker }}
                </p>
                <p class="unfinished-flows-list__chain-name">
                  {{ unfinishedFlow.flow.isTypeWithdraw
                    ? unfinishedFlow.chain.name
                    : baseChain.name
                  }}
                </p>
              </div>
              <p class="unfinished-flows-list__destination">
                {{ unfinishedFlow.flow.sender }}
              </p>
              <app-button
                class="unfinished-flows-list__repeat-btn"
                scheme="secondary"
                type="submit"
                :text="$t('bridge-page.unfinished-flows-list.repeat-btn')"
                @click="openForm(id)"
              />
            </div>
          </template>
          <template v-else>
            <no-data-message
              :message="$t('bridge-page.unfinished-flows-list.no-data-message')"
              is-row-block
            />
          </template>
        </template>
      </template>
      <template v-else>
        <loader />
      </template>
    </div>

    <collection-loader
      ref="collectionLoader"
      class="unfinished-flows-list__collection-loader"
      :first-page-loader="getUnfinishedFlows"
      :page-limit="2"
      @first-page-load="setList"
      @next-page-load="concatList"
    />

    <drawer
      v-model:is-shown="isRepeatOpen"
      is-default-body
    >
      <template #heading>
        {{ drawerHeader }}
      </template>
      <unfinished-flows-from
        :unfinished-flow="selectedFlow"
        :base-chain="baseChain"
        @closeDrawer="closeDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import UnfinishedFlowsFrom from '@bridge-page/tabs/unfinished-flows/UnfinishedFlowsFrom'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { ref, reactive, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { bridgeEthereumApi } from '@api'
import { useWeb3, useFormatBalance } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { UnfinishedFlowRecord } from '@/js/records/unfinished-flow.record'

export default {
  name: 'unfinished-flows-list',

  components: {
    Drawer,
    UnfinishedFlowsFrom,
    NoDataMessage,
    CollectionLoader,
    ErrorMessage,
    Loader,
  },

  props: {
    chains: {
      type: Array, /** {@link ChainRecord} **/
      required: true,
    },
    tokens: {
      type: Array, /** {@link TokenRecord} **/
      required: true,
    },
    baseChain: { type: Object, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const { toExternalBalance } = useFormatBalance()
    const state = reactive({
      isRepeatOpen: false,
      selectedFlow: null,
      unfinishedFlows: [],
      isLoaded: false,
      isLoadFailed: false,
    })
    const collectionLoader = ref(null)
    const { web3Account } = useWeb3()

    const drawerHeader = computed(() =>
      state.selectedFlow.flow.isTypeWithdraw
        ? t('bridge-page.unfinished-flows-list.withdraw-drawer-header')
        : t('bridge-page.unfinished-flows-list.deposit-drawer-header'),
    )

    function openForm (index) {
      state.selectedFlow = props.unfinishedFlows[index]
      state.isRepeatOpen = true
    }

    async function getUnfinishedFlows () {
      let response
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        response = await bridgeEthereumApi.get('/oracle/flows', {
          page: {
            limit: 2,
          },
          filter: {
            sender: web3Account.value,
          },
        })
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
      return response
    }

    function collectioningUnfinishedFlows (flowRecords) {
      return flowRecords.map(flow => {
        const chain = props.chains.find(curChain =>
          curChain.id === flow.chainId,
        )
        const token = props.tokens.find(curToken =>
          curToken.chainId === flow.chainId &&
              curToken.ticker === flow.ticker,
        )

        return {
          chain,
          token,
          flow,
          decimals: +token.nativeChainDecimals,
        }
      })
    }

    function setList (newList) {
      const flowRecords = newList.map(i => (new UnfinishedFlowRecord(i)))
      state.unfinishedFlows = collectioningUnfinishedFlows(flowRecords)
    }

    function concatList (newChunk) {
      const newChunkRecords =
        newChunk.map(i => (new UnfinishedFlowRecord(i)))
      const newUnfinishedFlows = collectioningUnfinishedFlows(newChunkRecords)
      state.stakingList = state.stakingList.concat(newUnfinishedFlows)
    }

    async function closeDrawer () {
      state.isRepeatOpen = false
      await collectionLoader.value.loadFirstPage()
    }

    return {
      ...toRefs(state),
      openForm,
      drawerHeader,
      closeDrawer,
      toExternalBalance,
      getUnfinishedFlows,
      setList,
      concatList,
      collectionLoader,
      web3Account,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

$grid-columns: 27rem
  minmax(20rem, 1fr)
  repeat(2, 15rem)
  minmax(20rem, 1fr)
  minmax(9rem, 12rem);

.unfinished-flows-list__body {
  overflow-x: auto;

  @include scrollbar;
}

.unfinished-flows-list__row {
  display: grid;
  grid-template-columns: $grid-columns;
  grid-gap: 0 1.4rem;
  align-items: center;
  height: 5.2rem;
  padding: 0 1.6rem;
  min-width: min-content;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}

.unfinished-flows-list__headers {
  display: grid;
  grid-template-columns: $grid-columns;
  grid-gap: 0 1.4rem;
  padding: 0 1.6rem;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.unfinished-flows-list__header {
  white-space: nowrap;
}

.unfinished-flows-list__destination-header {
  grid-column: 5/-1;
}

.unfinished-flows-list__type,
.unfinished-flows-list__amount {
  font-size: 1.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unfinished-flows-list__type {
  text-transform: uppercase;
}

.unfinished-flows-list__chain-token {
  font-size: 1.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unfinished-flows-list__chain-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $col-app-secondary;
}

.unfinished-flows-list__destination {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unfinished-flows-list__collection-loader {
  margin-top: 2rem;
}
</style>
