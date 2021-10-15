<template>
  <div class="settings-metadata-tab">
    <h1 class="settings-metadata-tab__header">
      <!-- eslint-disable-next-line max-len -->
      {{ $t('settings-page.settings-metadata-tab.chain-specifications-header') }}
    </h1>
    <div class="settings-metadata-tab__content">
      <div class="settings-metadata-tab__info">
        <value-displayer
          class="settings-metadata-tab__value-displayer"
          :header-level="5"
          :value-level="4"
          :header="$t('settings-page.settings-metadata-tab.network-header')"
          :value="systemChain"
        >
          <div class="settings-metadata-tab__network-wrap">
            <img
              class="settings-metadata-tab__network-logo"
              src="@static/branding/logo.png"
              :alt="$t('settings-page.settings-metadata-tab.network-logo')"
            >
            <p class="settings-metadata-tab__network">
              {{ systemChain }}
            </p>
          </div>
        </value-displayer>

        <value-displayer
          v-for="(item, index) in systemInfo"
          :key="index"
          class="settings-metadata-tab__value-displayer"
          :header-level="5"
          :value-level="4"
          :header="item.title"
          :value="item.value"
        />
      </div>
      <div class="settings-metadata-tab__qr">
        <qr-code-wrapper
          :value="qrValue"
          :size="250"
          background="#f6f8fb"
          foreground="#262626"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@api'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { formatBalance, isNumber } from '@polkadot/util'
import { DEFAULT_SS58 } from '@/js/const/api-default-params.const'

const CHAINT_TYPES = {
  ethereum: 'ethereum',
  substrate: 'substrate',
}

export default {
  name: 'settings-metadata-tab',

  components: {
    ValueDisplayer,
    QrCodeWrapper,
  },

  setup () {
    const store = useStore()
    const { t } = useI18n()

    const systemChain = computed(() => store.getters[vuexTypes.systemChain])

    const systemInfo = ref({
      genesisHash: {
        title: t('settings-page.settings-metadata-tab.genesis-hash-header'),
        value: api.genesisHash.toHex(),
      },
      tokenSymbol: {
        title: t('settings-page.settings-metadata-tab.unit-header'),
        value:
          (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
      },
      ss58Format: {
        title: t('settings-page.settings-metadata-tab.address-prefix-header'),
        value: isNumber(api.registry.chainSS58)
          ? api.registry.chainSS58
          : DEFAULT_SS58.toNumber(),
      },
      tokenDecimals: {
        title: t('settings-page.settings-metadata-tab.decimals-header'),
        value: api.registry.chainDecimals.toString(),
      },
      chainType: {
        title: t('settings-page.settings-metadata-tab.chain-type-header'),
        value: api.isEthereum
          ? CHAINT_TYPES.ethereum
          : CHAINT_TYPES.substrate,
      },
    })

    const qrValue = computed(() => {
      return JSON.stringify({
        title: systemChain.value,
        genesisHash: systemInfo.value.genesisHash.value,
        prefix: systemInfo.value.ss58Format.value,
        decimals: systemInfo.value.tokenDecimals.value,
        unit: systemInfo.value.tokenSymbol.value,
        chainType: systemInfo.value.chainType.value,
      })
    })

    return {
      systemChain,
      systemInfo,
      qrValue,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.settings-metadata-tab { @include app-padding; }

.settings-metadata-tab__header {
  margin-bottom: 2rem;
}

.settings-metadata-tab__content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 3rem;

  @include respond-to($sidebar-hide-bp) {
    grid-template-columns: 1fr;
  }
}

.settings-metadata-tab__value-displayer {
  padding: 1.6rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}

.settings-metadata-tab__qr {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 0;

  @include content-block;
}

.settings-metadata-tab__info {
  overflow: hidden;
}

.settings-metadata-tab__network-wrap {
  display: flex;
  align-items: center;
}

.settings-metadata-tab__network-logo {
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 1.4rem;
}

.settings-metadata-tab__network {
  font-size: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
