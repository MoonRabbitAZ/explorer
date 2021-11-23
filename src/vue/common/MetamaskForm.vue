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
import CONFIG from '@/config'

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

    const isMobile = computed(() =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    )

    const messageTranslation = computed(() => {
      if (isMetamaskEnabled.value) {
        return t('common.metamask-form.connect-msg')
      } else if (isMobile.value) {
        return t('common.metamask-form.mobile-open-msg')
      } else {
        return t('common.metamask-form.create-msg')
      }
    })

    const buttonTranslation = computed(() => {
      if (isMetamaskEnabled.value) {
        return t('common.metamask-form.connect-btn')
      } else if (isMobile.value) {
        return t('common.metamask-form.open-metamask-btn')
      } else {
        return t('common.metamask-form.download-btn')
      }
    })

    async function onButtonClick () {
      isMetamaskProcessing.value = true
      try {
        if (isMetamaskEnabled.value) {
          await connectWeb3()
        } else if (isMobile.value) {
          window.open(CONFIG.OPEN_METAMASK_MOBILE_APP_LINK, '_blank', 'noopener')
        } else {
          window.open(METAMASK_DOWNLOAD_URL, '_blank', 'noopener')
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
