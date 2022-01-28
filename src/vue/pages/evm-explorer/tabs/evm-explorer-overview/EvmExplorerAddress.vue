<template>
  <div class="evm-explorer-address">
    <template v-if="loading">
      <loader/>
    </template>
    <template v-else-if="error">
      <error-message :message="error.message" />
    </template>
    <template v-else>
      <!-- eslint-disable  max-len-->
      <div class="evm-explorer-address__info">
        <h1>
          {{ $t('evm-explorer-page.evm-explorer-address.address-details-header') }}
        </h1>
        <div class="evm-explorer-address__info-block">
          <div class="evm-explorer-address__hash-wrap">
            <h3 class="evm-explorer-address__hash">
              {{ result.address.hash }}
            </h3>
            <app-button
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
        </div>
      </div>

      <evm-transactions-list
        :address-hash="result.address.hash"
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
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Drawer from '@/vue/common/Drawer'

import QrCodeWrapper from '@/vue/common/QrCodeWrapper'
import { ClipboardField } from '@/vue/fields'

import { reactive, ref, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'

import CONFIG from '@/config'
import GET_ADDRESS from '@/graphql/queries/getAddress.gql'

export default {
  name: 'evm-explorer-address',

  components: {
    InfoValue,
    Loader,
    ErrorMessage,
    EvmTransactionsList,
    Drawer,
    QrCodeWrapper,
    ClipboardField,
  },

  props: {
    hash: { type: String, required: true },
  },

  setup (props) {
    const isQrDrawerOpen = ref(false)
    const accountVariables = reactive({
      hash: props.hash,
      transactionFirst: 6,
    })

    const { result, loading, error } =
      useQuery(GET_ADDRESS, accountVariables)

    const transactions = computed(() =>
      result.value?.address?.transactions?.edges,
    )

    function selectHash () {
      accountVariables.hash = props.hash
    }

    watch(() => props.hash, selectHash)

    return {
      isQrDrawerOpen,
      result,
      loading,
      error,
      transactions,
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

.evm-explorer-address__info-row {
  & + & {
    margin-top: 2.4rem;
  }
}

.evm-explorer-address__info {
  margin-bottom: 4rem;
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
