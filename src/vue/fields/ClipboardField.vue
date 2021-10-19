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

      <button
        ref="clipboardBtn"
        v-tooltip.top-end="tooltipOptions"
        class="clipboard-field__button"
        :data-clipboard-target="`#clipboard-target-${uid}`"
        type="button"
      >
        <icon
          class="clipboard-field__button-icon"
          name="copy"
        />
      </button>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import Icon from '@/vue/common/Icon'

import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const HIDE_TOOLTIP_TIMEOUT = 2000 // ms

export default {
  name: 'clipboard-field',

  components: { Icon },

  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },

  setup () {
    const { t } = useI18n()
    const clipboardBtn = ref(null)
    const clipboard = ref({})
    const uid = getCurrentInstance().uid

    const tooltipOptions = computed(() => ({
      content: t('fields.clipboard-field.copied-msg'),
      showTriggers: ['click'],
      delay: {
        show: 0,
        hide: HIDE_TOOLTIP_TIMEOUT,
      },
    }))

    onMounted(() => {
      if (!clipboardBtn.value) return
      clipboard.value = new Clipboard(clipboardBtn.value)
      clipboard.value.on('success', event => {
        setTimeout(() => {
          event.clearSelection()
        }, HIDE_TOOLTIP_TIMEOUT)
      })
    })

    return {
      clipboardBtn,
      getCurrentInstance,
      uid,
      tooltipOptions,
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
  display: block;

  position: relative;
}

.clipboard-field__button-icon {
  width: 2.4rem;
  height: 2.4rem;

  &:hover {
    color: $col-app-accent;
  }
}
</style>
