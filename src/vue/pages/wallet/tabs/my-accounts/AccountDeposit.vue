<template>
  <div class="account-deposit">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :header="'Error'"
          :message="'There was an error while loading.'"
        />
      </template>
      <template v-else>
        <p class="account-deposit__info">
          {{ $t('info-text') }}
        </p>
        <clipboard-field
          class="account-deposit__clipboard"
          :value="depositId"
        />
        <qr-code-wrapper
          :value="depositId"
          :size="250"
          background="#f6f8fb"
          foreground="#262626"
        />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'
import { ClipboardField } from '@/vue/fields'

import { reactive, toRefs } from 'vue'
import { restApi } from '@api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'account-deposit',

  components: {
    ClipboardField,
    QrCodeWrapper,
    ErrorMessage,
    Loader,
  },

  props: {
    accountAddress: { type: String, required: true },
  },

  setup (props) {
    const state = reactive({
      isLoaded: true,
      isLoadFailed: false,
      depositId: '',
    })

    async function getDepositId () {
      const response = await restApi.post('bridge/addresses', {
        data: {
          attributes: {
            moonrabbit_address: props.accountAddress,
          },
        },
      })
      return response?.data?.id ?? ''
    }

    async function init () {
      state.isLoaded = false
      state.isLoadFailed = false
      try {
        state.depositId = await getDepositId()
      } catch (e) {
        state.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }

      state.isLoaded = true
    }

    init()

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.account-deposit {
  padding: 0 $drawer-padding;
}

.account-deposit__info {
  color: $col-app-secondary;
  line-height: 1.6rem;
  margin-bottom: 5rem;
}

.account-deposit__clipboard {
  margin-bottom: 3rem;

  .clipboard-field__value {
    font-size: 1.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "info-text": "To receive tokens inside Moon Rabbit network transfer ERC20 token to this address:",
  }
}
</i18n>
