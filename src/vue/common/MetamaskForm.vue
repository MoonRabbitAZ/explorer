<template>
  <div class="metamask-form">
    <icon
      class="metamask-form__icon"
      name="metamask"
    />
    <p class="metamask-form__message">
      {{ messageTranslation }}
    </p>
    <app-button
      class="metamask-form__button"
      scheme="primary"
      :text="buttonTranslation"
      :disabled="isMetamaskProcessing"
      @click="onButtonClick"
    />
  </div>
</template>

<script>
import Icon from '@/vue/common/Icon'

import { ref, computed } from 'vue'
import { useWeb3 } from '@/vue/composables'
import { useI18n } from 'vue-i18n'
import { ErrorHandler } from '@/js/helpers/error-handler'

const METAMASK_DOWNLOAD_URL = 'https://metamask.io/download.html'

export default {
  name: 'bridge-tokens-tab',

  components: { Icon },

  setup () {
    const isMetamaskProcessing = ref(false)
    const { t } = useI18n()
    const {
      web3Account,
      isMetamaskConnected,
      isMetamaskEnabled,
      connectWeb3,
    } = useWeb3()

    const messageTranslation = computed(() =>
      isMetamaskEnabled.value
        ? t('common.metamask-form.connect-msg')
        : t('common.metamask-form.create-msg'),
    )

    const buttonTranslation = computed(() =>
      isMetamaskEnabled.value
        ? t('common.metamask-form.connect-btn')
        : t('common.metamask-form.download-btn'),
    )

    async function onButtonClick () {
      isMetamaskProcessing.value = true
      try {
        if (isMetamaskEnabled.value) {
          await connectWeb3()
        } else {
          window.open(METAMASK_DOWNLOAD_URL)
        }
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      isMetamaskProcessing.value = false
    }

    return {
      messageTranslation,
      isMetamaskEnabled,
      web3Account,
      isMetamaskConnected,
      buttonTranslation,
      onButtonClick,
      isMetamaskProcessing,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.metamask-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metamask-form__message {
  font-size: 1.4rem;
  margin-top: 3rem;
  text-align: center;
}

.metamask-form__icon {
  width: 9rem;
  height: 9rem;
}

.metamask-form__button {
  margin-top: 3rem;
}
</style>
