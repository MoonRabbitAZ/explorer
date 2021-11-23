<template>
  <div class="unfinished-flows-list">
    <div class="unfinished-flows-list__headers">
      <h1 class="unfinished-flows-list__header">
        {{ $t('bridge-page.unfinished-flows-list.type-header') }}
      </h1>
      <h4 class="unfinished-flows-list__header">
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
        <p class="unfinished-flows-list__amount-wrap">
          <span
            v-tooltip="!unfinishedFlow.flow.tokenId && $fFullBalance(
              unfinishedFlow.flow.amount,
              unfinishedFlow.decimals,
              unfinishedFlow.token.ticker,
            )"
            class="unfinished-flows-list__amount"
          >
            {{
              unfinishedFlow.flow.tokenId || toExternalBalance(
                unfinishedFlow.flow.amount,
                unfinishedFlow.decimals,
                unfinishedFlow.token.ticker,
              )
            }}

          </span>
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

import { reactive, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatBalance } from '@/vue/composables'

const EVENTS = {
  updateFlowList: 'update-flow-list',
}

export default {
  name: 'unfinished-flows-list',

  components: {
    Drawer,
    UnfinishedFlowsFrom,
    NoDataMessage,
  },

  props: {
    unfinishedFlows: {
      type: Array,
      required: true,
    },
    baseChain: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { t } = useI18n()
    const { toExternalBalance } = useFormatBalance()
    const state = reactive({
      isRepeatOpen: false,
      selectedFlow: null,
    })

    const drawerHeader = computed(() =>
      state.selectedFlow.flow.isTypeWithdraw
        ? t('bridge-page.unfinished-flows-list.withdraw-drawer-header')
        : t('bridge-page.unfinished-flows-list.deposit-drawer-header'),
    )

    function openForm (index) {
      state.selectedFlow = props.unfinishedFlows[index]
      state.isRepeatOpen = true
    }

    function closeDrawer () {
      state.isRepeatOpen = false
      emit(EVENTS.updateFlowList)
    }

    return {
      ...toRefs(state),
      openForm,
      drawerHeader,
      closeDrawer,
      toExternalBalance,
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

.unfinished-flows-list {
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

.unfinished-flows-list__amount-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
