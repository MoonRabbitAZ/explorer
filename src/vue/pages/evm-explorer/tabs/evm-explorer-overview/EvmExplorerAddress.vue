<template>
  <div class="evm-explorer-address" :key="hash">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message
        :message="$t('evm-explorer-page.evm-explorer-address.balance-header')"
      />
    </template>
    <template v-else>
      <!-- eslint-disable  max-len-->
      <div class="evm-explorer-address__info">
        <h1>
          {{ headerTranslation }}
        </h1>
        <div class="evm-explorer-address__info-block">
          <div class="evm-explorer-address__hash-wrap">
            <h3 class="evm-explorer-address__hash">
              {{ result.address.hash }}
            </h3>
            <app-button
              class="evm-explorer-address__qr-button"
              mdi-icon-name="mdi-qrcode"
              size="small"
              scheme="secondary"
              @click="isQrDrawerOpen = true"
            />
          </div>

          <info-value
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.balance-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.balance-info')
            "
            :value="$fFullBalance(
              result.address.fetchedCoinBalance,
              CONFIG.EVM_TOKEN_DECIMAL,
              CONFIG.EVM_TOKEN_TICKER
            )"
          />

          <info-value
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.transactions-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.transactions-info')
            "
            :value="$fnumber(result.address.transactionCount)"
          />

          <info-value
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.transfers-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.transfers-info')
            "
            :value="$fnumber(result.address.transferCount)"
          />

          <info-value
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.gas-used-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.gas-used-info')
            "
            :value="$fnumber(result.address.gasUsed)"
          />

          <info-value
            v-if="result.address.fetchedCoinBalanceBlockNumber"
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.last-balance-update-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.last-balance-update-info')
            "
            :value="$fnumber(result.address.fetchedCoinBalanceBlockNumber)"
          />

          <info-value
            v-if="result.address.validationCount"
            class="evm-explorer-address__info-row"
            :header="$t('evm-explorer-page.evm-explorer-address.blocks-validated-header')"
            :info-tooltip="
              $t('evm-explorer-page.evm-explorer-address.blocks-validated-info')
            "
            :value="$fnumber(result.address.validationCount)"
          />
        </div>
      </div>

      <evm-transactions-list
        class="evm-explorer-address__list"
        :address-hash="hash"
        :time-now="timeNow"
        :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      />

      <evm-token-transfers-list
        class="evm-explorer-address__list"
        :address-hash="hash"
        :time-now="timeNow"
        :no-data-message="$t('evm-explorer-page.evm-explorer-address.no-data-message-transactions')"
      />
      <!-- eslint-enable  max-len-->
    </template>

    <drawer
      v-model:is-shown="isQrDrawerOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('evm-explorer-page.evm-explorer-address.qr-drawer-title') }}
      </template>
      <div class="evm-explorer-address__drawer-body">
        <qr-code-wrapper
          class="evm-explorer-address__drawer-qr"
          :value="result.address.hash"
          :size="250"
        />
        <div class="evm-explorer-address__drawer-address">
          <h3>
            <!-- eslint-disable-next-line max-len -->
            {{ $t('evm-explorer-page.evm-explorer-address.address-drawer-title') }}
          </h3>
          <div class="evm-explorer-address__drawer-clipboard-wrap">
            <clipboard-field
              :value="result.address.hash"
            />
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script>
import InfoValue from '@evm-explorer-page/tabs/evm-explorer-overview/InfoValue'
import EvmTransactionsList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTransactionsList'
import EvmTokenTransfersList from '@evm-explorer-page/tabs/evm-explorer-overview/EvmTokenTransfersList'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Drawer from '@/vue/common/Drawer'

import QrCodeWrapper from '@/vue/common/QrCodeWrapper'
import { ClipboardField } from '@/vue/fields'

import { reactive, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useTimeNow } from '@/vue/composables'

import CONFIG from '@/config'
import GET_ADDRESS from '@/graphql/queries/getAddress.gql'

export default {
  name: 'evm-explorer-address',

  components: {
    InfoValue,
    Loader,
    ErrorMessage,
    EvmTransactionsList,
    EvmTokenTransfersList,
    Drawer,
    QrCodeWrapper,
    ClipboardField,
  },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const timeNow = useTimeNow()
    const isQrDrawerOpen = ref(false)
    const accountVariables = reactive({
      hash: props.hash,
      transactionFirst: 6,
    })

    const { result, loading, error } =
      useQuery(GET_ADDRESS, accountVariables)

    function selectHash () {
      accountVariables.hash = props.hash
    }

    const headerTranslation = computed(() =>
      result.value?.address?.contractCode
        ? t('evm-explorer-page.evm-explorer-address.contract-address-details-header')
        : t('evm-explorer-page.evm-explorer-address.address-details-header'),
    )
    watch(() => props.hash, selectHash)

    return {
      timeNow,
      isQrDrawerOpen,
      result,
      loading,
      error,
      headerTranslation,
      CONFIG,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.evm-explorer-address__info-block {
  padding: 1.8rem;
  margin-top: 2rem;

  @include content-block;
}

.evm-explorer-address__hash-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.evm-explorer-address__hash {
  overflow: visible;
  word-break: break-all;
  margin-right: 2rem;
}

.evm-explorer-address__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

.evm-explorer-address__list {
  margin-top: 4rem;
}

.evm-explorer-address__drawer-body {
  padding: 2rem $drawer-padding;
}

.evm-explorer-address__drawer-qr {
  margin: 0 auto 3rem;
}

.evm-explorer-address__drawer-clipboard-wrap {
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
  margin-top: 1rem;
  padding: 1.6rem;
  border-radius: 0.4rem;
}
</style>
