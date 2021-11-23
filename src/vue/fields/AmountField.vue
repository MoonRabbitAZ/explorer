<template>
  <input-field
    v-bind="$attrs"
    v-model="value"
    @input="onInput"
    type="text"
    autocomplete="off"
    :label="label"
    :error-message="errorMessage"
  />
</template>

<script>
import { InputField } from '@/vue/fields'

import { ref } from 'vue'
import { api } from '@api'
import { fromWei } from '@/js/util/amount.util'
import BN from 'bn.js'
import { BN_TEN } from '@polkadot/util'

const EVENTS = {
  updateModelValue: 'update:modelValue',
}

export default {
  name: 'amount-field',

  components: { InputField },

  props: {
    label: { type: String, default: '' },
    modelValue: { type: [String, Number], default: '' },
    errorMessage: { type: String, default: '' },
    decimals: { type: Number, default: api.registry.chainDecimals[0] },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const value = ref('')

    function inputToBn (input) {
      const div = new BN(input.replace(/\.\d*$/, ''))
      const modString = input.replace(/^\d+\.?/, '')

      const mod = new BN(modString || 0)

      const result = div
        .mul(BN_TEN.pow(new BN(props.decimals)))
        .add(mod.mul(BN_TEN.pow(new BN(props.decimals - modString.length))))

      return result
    }

    function onInput (event) {
      const formatValue = event.target.value.replace(/,/, '.')
      value.value = formatValue.match(`\\d*\\.?\\d{0,${props.decimals}}`)[0]
      if (value.value === '.') value.value = '0.'
      emit(EVENTS.updateModelValue, inputToBn(value.value).toString())
    }

    value.value = fromWei(props.modelValue, props.decimals)

    return { onInput, value }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

</style>
