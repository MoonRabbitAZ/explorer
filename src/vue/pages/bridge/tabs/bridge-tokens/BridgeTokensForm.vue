<template>
  <div class="bridge-tokens-form">
    <div class="bridge-tokens-form__body">
      <div class="bridge-tokens-form__current-token-wrap">
        <select-field
          v-model="form.currentToken.value"
          :label="$t('bridge-page.bridge-tokens-form.asset-lbl')"
          :options="label"
          :can-deselect="false"
          @blur="form.currentToken.blur"
          searchable
          clear-on-search
        >
          <template v-slot:option="{ option }">
            {{ option.label }}
          </template>
        </select-field>
      </div>
      <div class="bridge-tokens-form__chains">
        <bridge-info-block
          class="bridge-tokens-form__chain-block"
          :header="$t('bridge-page.bridge-tokens-form.from-header')"
          img-url="../static/branding/logo.png"
          value="ETH"
          secondary-value="Ethereum"
        />

        <app-button
          class="bridge-tokens-form__switch-btn"
          size="small"
          scheme="primary"
          mdi-icon-name="mdi-autorenew"
        />

        <bridge-info-block
          class="bridge-tokens-form__chain-block"
          :header="$t('bridge-page.bridge-tokens-form.to-header')"
          img-url="../static/branding/logo.png"
          value="ETH"
          secondary-value="Ethereum"
        />
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-field
            v-model="form.amount.value"
            @blur="form.amount.blur"
            name="staking-form-founds-step-amount"
            :error-message="form.amount.errorMessage"
            :label="$t('bridge-page.bridge-tokens-form.amount-lbl', {
              balance: '100.3223 USDT'
            })"
            :disabled="isFormDisabled"
          />
        </div>
      </div>
      <!-- eslint-disable max-len -->
      <bridge-info-block
        class="bridge-tokens-form__destination-block"
        :header="$t('bridge-page.bridge-tokens-form.destination-header')"
        img-url="../static/branding/logo.png"
        :value="'6a921700b007800c6a921700b007800c007800c007800c007800c007800cdfdjhj4hkjh3jsdhcjksdhc'"
      />
      <p class="bridge-tokens-form__destination-info">
        {{ $t('bridge-page.bridge-tokens-form.destination-info') }}
      </p>

      <app-button
        class="bridge-tokens-form__next-btn"
        scheme="primary"
        :text="$t('bridge-page.bridge-tokens-form.next-btn')"
        @click="isFormConfirmationOpen = true"
      />

      <i18n-t
        class="bridge-tokens-form__mainet-transfer-msg"
        keypath="bridge-page.bridge-tokens-form.mainet-transfer-msg"
        tag="p"
      >
        <template #link>
          <a
            :href="MAINET_TRANSFER_INFO_LINK"
            target="_blank"
            rel="noopener"
          >
            {{ $t('bridge-page.bridge-tokens-form.mainet-transfer-link') }}
          </a>
        </template>
      </i18n-t>
    </div>

    <drawer
      v-model:is-shown="isFormConfirmationOpen"
      is-default-body
    >
      <template #heading>
        {{ $t('bridge-page.bridge-tokens-form.drawer-confirmation-header') }}
      </template>
      <bridge-confirmation />
    </drawer>
  </div>
</template>

<script>
import { SelectField, AmountField } from '@/vue/fields'
import Drawer from '@/vue/common/Drawer'
import BridgeInfoBlock from '@bridge-page/tabs/bridge-tokens/BridgeInfoBlock'
import BridgeConfirmation from '@bridge-page/tabs/bridge-tokens/BridgeConfirmation'

import { ref } from 'vue'
import { TokenRecord } from '@/js/records/token.record'
import { useForm } from '@/vue/composables'

const MAINET_TRANSFER_INFO_LINK = 'https://lib.moonrabbit.com/'

const ASSETS_LIST = [
  {
    tokenKey: {
      ticker: 'USDT',
      chainId: 13,
    },
    attributes: {
      originalChainId: 13,
      type: 'erc20',
      originalContract: '0x231312321312312',
      internalContract: '0x321342413213231',
    },
  },
]

export default {
  name: 'bridge-tokens-form',

  components: {
    SelectField,
    Drawer,
    BridgeInfoBlock,
    AmountField,
    BridgeConfirmation,
  },

  setup () {
    const tokens = ref(ASSETS_LIST.map(i => new TokenRecord(i)))
    const isFormConfirmationOpen = ref(false)

    const label = ref(tokens.value.map((i) => {
      return {
        label: i.tokenTicker,
        value: i.tokenKey,
      }
    }))

    const formController = useForm({
      currentToken: {
        value: label.value[0].value,
      },
      amount: {
        value: 0,
      },
    })

    return {
      ...formController,
      tokens,
      isFormConfirmationOpen,
      label,
      MAINET_TRANSFER_INFO_LINK,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.bridge-tokens-form__chains {
  display: grid;
  grid-template-columns: 1fr 3.6rem 1fr;
  grid-gap: 2rem 3.2rem;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2rem;

  @include respond-to($small) {
    grid-template-columns: 3.6rem 1fr;
    grid-gap: 2rem;
    align-items: center;
  }
}

.bridge-tokens-form__chain-block {
  flex: 1;
}

.bridge-tokens-form__switch-btn {
  margin-bottom: 1.55rem;

  @include respond-to($small) {
    grid-row: 1/3;
    grid-column: 1/2;
  }
}

.bridge-tokens-form__destination-block {
  margin-top: 2rem;
}

.bridge-tokens-form__destination-info {
  margin-top: 0.4rem;
  color: $col-app-secondary;
}

.bridge-tokens-form__next-btn {
  min-width: 12.3rem;
  margin-top: 2rem;

  @include respond-to($x-small) {
    width: 100%;
  }
}

.bridge-tokens-form__mainet-transfer-msg {
  text-align: center;
  margin-top: 2rem;
}
</style>
