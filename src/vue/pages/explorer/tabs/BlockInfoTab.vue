<template>
  <div class="block-info-tab">
    <div class="block-info-tab__search-wrap">
      <input-field
        v-model="form.search.value"
        class="block-info-tab__search-field"
        name="block-info-tab-search"
        :placeholder="$t('search-field-placeholder')"
        :error-message="form.search.errorMessage"
        @blur="form.search.blur"
      />

      <app-button
        scheme="primary"
        mdi-icon-name="mdi-magnify"
        @click="searchBlock"
      />
    </div>
    <template v-if="isLoaded">
      <block-info-summary
        class="block-info-tab__summary"
        :events="events"
        :block="block"
      />
      <block-header
        class="block-info-tab__block-header"
        :header="header"
      />

      <block-extrinsics
        class="block-info-tab__extrinsics"
        :events="events"
        :block-number="blockNumber.toNumber()"
        :extrinsics="block.block.extrinsics"
      />

      <div class="block-info-tab__system">
        <system-events :events="events" />

        <block-logs :logs="header.digest.logs"/>
      </div>
    </template>
    <template v-else-if="isLoadFailed">
      <no-data-message
        class="block-info-tab__no-data"
        :message="$t('no-data-message')"
      />
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import InputField from '@/vue/fields/InputField'
import BlockHeader from '@explorer-page/tabs/block-info/BlockHeader'
import BlockInfoSummary from '@explorer-page/tabs/block-info/BlockInfoSummary'
import BlockExtrinsics from '@explorer-page/tabs/block-info/BlockExtrinsics'
import SystemEvents from '@explorer-page/tabs/block-info/SystemEvents'
import BlockLogs from '@explorer-page/tabs/block-info/BlockLogs'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { isHex } from '@polkadot/util'
import { watch, reactive, toRefs } from 'vue'
import { api } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useRoute, useRouter } from 'vue-router'
import { vueRoutes } from '@/vue-router'
import { useForm, useValidators } from '@/vue/composables'

import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

export default {
  name: 'block-info-tab',

  components: {
    Loader,
    BlockHeader,
    BlockInfoSummary,
    BlockExtrinsics,
    SystemEvents,
    BlockLogs,
    InputField,
    NoDataMessage,
  },

  setup () {
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      events: [],
      block: {},
      header: {},
      blockNumber: 0,
      parentHash: '',
      hasParent: '',
      ident: '',
      isLoadFailed: false,
      isLoaded: false,
    })

    const { maxLength, blockIdent } = useValidators()

    const formController = useForm({
      search: {
        value: '',
        validators: {
          maxLength: maxLength(MAX_FIELD_LENGTH.search),
          blockIdent,
        },
      },
    })

    async function setIdent (blockIdent) {
      try {
        if (blockIdent) {
          state.ident = isHex(blockIdent)
            ? blockIdent
            : (await api.rpc.chain.getBlockHash(blockIdent)).toHex()
        } else {
          const bestNumber = await api.derive.chain.bestNumber()
          state.ident = (await api.rpc.chain.getBlockHash(bestNumber)).toHex()
        }
      } catch (e) {
        throw new Error(e)
      }
    }

    async function init (blockIdent) {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        await setIdent(blockIdent)
        const [events, block, header] = await Promise.all([
          api.query.system.events.at(state.ident),
          api.rpc.chain.getBlock(state.ident),
          api.derive.chain.getHeader(state.ident),
        ])
        state.events = events
        state.block = block
        state.header = header
        state.blockNumber = header?.number.unwrap()
        state.parentHash = header?.parentHash.toHex()
        state.isLoaded = true
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    }

    function searchBlock () {
      if (formController.isFormValid() && formController.form.search.value) {
        router.push({
          ...vueRoutes.blockInfoTab,
          query: {
            blockIdent: formController.form.search.value,
          },
        })

        formController.form.search.value = ''
      }
    }

    watch(route, (val) => init(val.query.blockIdent), { immediate: true })

    return {
      ...toRefs(state),
      ...formController,
      searchBlock,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-info-tab { @include app-padding; }

.block-info-tab__block-header,
.block-info-tab__extrinsics,
.block-info-tab__system {
  margin-top: 3rem;
}

.block-info-tab__system {
  display: grid;
  grid-gap: 3rem 2rem;
  max-width: 100%;
  grid-template-columns: repeat(2, minmax(35rem, 1fr));

  @include respond-to($sidebar-hide-bp) {
    grid-template-columns: minmax(30rem, 1fr);
  }
}

.block-info-tab__search-wrap {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  margin-bottom: 3rem;
}

.block-info-tab__search-field {
  max-width: 37.5rem;
  margin-right: 2rem;
}

.block-info-tab__no-data {
  max-width: max-content;
  margin: 0 auto;
  margin-top: 8rem;
}
</style>

<i18n>
{
  "en": {
    "search-field-placeholder": "Search by hash or block number",
    "no-data-message": "Block not found"
  }
}
</i18n>
