<template>
  <div class="assign-evm-account-form">
    <template v-if="!isMetamaskConnected">
      <metamask-form class="bridge__metamask-form"/>
    </template>
    <template v-else>
      <h3 class="assign-evm-account-form__send-title">
        {{ $t('wallet-page.assign-evm-account-form.current-address-title') }}
      </h3>
      <div class="assign-evm-account-form__address-wrap">
        <account-address-row
          :account-address="currentAccountAddress"
          icon-size="big"
        />
      </div>
      <div class="assign-evm-account-form__content">
        <value-displayer
          class="assign-evm-account-form__evm-account"
          :header="
            $t('wallet-page.assign-evm-account-form.evm-address-title')
          "
          :value="web3Account"
          :value-level="1"
        />
        <div class="assign-evm-account-form__actions-wrap">
          <app-button
            size="big"
            scheme="primary"
            @click="assignAccount"
            :text="$t('wallet-page.assign-evm-account-form.assign-btn')"
            :disabled="isProcessing"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import AccountAddressRow from '@/vue/common/AccountAddressRow'
import MetamaskForm from '@/vue/common/MetamaskForm'

import { ref } from 'vue'
import { addressStorageApi } from '@api'
import { getAccountPair } from '@/js/helpers/account-helper'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { useWeb3 } from '@/vue/composables'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'assign-evm-account-form',

  components: { MetamaskForm, ValueDisplayer, AccountAddressRow },

  props: {
    currentAccountAddress: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const isProcessing = ref(false)
    const { isMetamaskConnected, web3Account, getPersonalSign } = useWeb3()

    async function assignAccount () {
      isProcessing.value = true
      try {
        // TODO: change message after added on backend
        const message = `Assign ${web3Account.value} to ${props.currentAccountAddress}`
        const messageU8a = stringToU8a(message)
        const acc = getAccountPair(props.currentAccountAddress)
        const mrSignature = u8aToHex(acc.sign(messageU8a))

        const evmSignature = await getPersonalSign(message)

        const query = {
          data: {
            id: props.currentAccountAddress,
            type: 'assign-address',
            attributes: {
              mr_signature: mrSignature,
              evm_address: web3Account.value,
              evm_signature: evmSignature.result,
            },
          },
        }

        await addressStorageApi.post(`/integrations/address-storage/addresses/${props.currentAccountAddress}`, query)
        Bus.success({
          messageId: 'wallet-page.assign-evm-account-form.assigned-success-msg',
          messageArgs: { address: web3Account.value },
        })
      } catch (e) {
        ErrorHandler.process(e)
      }
      isProcessing.value = false
    }

    return {
      isProcessing,
      isMetamaskConnected,
      web3Account,
      assignAccount,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.assign-evm-account-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.assign-evm-account-form__send-title {
  padding: 0 $drawer-padding;
  margin-bottom: 1rem;
}

.assign-evm-account-form__address-wrap {
  padding: 2rem $drawer-padding;
  display: flex;
  align-items: center;
  background: $col-app-block-bg;
}

.assign-evm-account-form__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 $drawer-padding;
  margin-top: 2rem;
}

.assign-evm-account-form__evm-account {
  margin-bottom: 2rem;
}

.assign-evm-account-form__actions-wrap {
  margin-top: auto;
  width: 100%;
}

</style>
