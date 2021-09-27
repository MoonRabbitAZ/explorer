<template>
  <div class="clipboard-field">
    <label class="clipboard-field__label">
      {{ label }}
    </label>

    <div class="clipboard-field__body">
      <p
        class="clipboard-field__value"
        :id="`clipboard-target-${uid}`"
      >
        {{ value }}
      </p>

      <tooltip :message="copiedMsg">
        <button
          ref="clipboardBtn"
          class="clipboard-field__button"
          :data-clipboard-target="`#clipboard-target-${uid}`"
          type="button"
        >
          <icon
            class="clipboard-field__button-icon"
            name="copy"
          />
        </button>
      </tooltip>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import Tooltip from '@/vue/common/Tooltip'
import Icon from '@/vue/common/Icon'

import { useI18n } from 'vue-i18n'
import { ref, getCurrentInstance, onMounted } from 'vue'

const HIDE_TOOLTIP_TIMEOUT = 2000 // ms

export default {
  name: 'clipboard-field',

  components: { Icon, Tooltip },

  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },

  setup () {
    const { t } = useI18n()
    const copiedMsg = ref('')
    const clipboardBtn = ref(null)
    const clipboard = ref({})
    const uid = getCurrentInstance().uid

    onMounted(() => {
      if (!clipboardBtn.value) return
      clipboard.value = new Clipboard(clipboardBtn.value)
      clipboard.value.on('success', event => {
        copiedMsg.value = t('fields.clipboard-field.copied-msg')
        setTimeout(() => {
          copiedMsg.value = ''
          event.clearSelection()
        }, HIDE_TOOLTIP_TIMEOUT)
      })
    })

    return {
      clipboardBtn,
      getCurrentInstance,
      copiedMsg,
      uid,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.clipboard-field {
  width: 100%;
}

.clipboard-field__value {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 2rem;
}

.clipboard-field__label {
  color: $col-app-secondary;
}

.clipboard-field__body {
  display: flex;
  align-items: center;
}

.clipboard-field__button {
  width: 2.4rem;
  height: 2.4rem;
  position: relative;
}

.clipboard-field__button-icon {
  width: 100%;
  height: 100%;

  &:hover {
    color: $col-app-accent;
  }
}
</style>
