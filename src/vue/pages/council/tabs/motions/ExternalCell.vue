<template>
  <div
    v-if="proposal"
    class="external-cell"
  >
    <template>
      <div>
        <params
          :params="externalParamsWithValues"
          :registry="extractExternal.registry"
        />
      </div>
      <div>
        <clipboard-field
          v-if="extractExternal.hash"
          class="external-cell__secondary-item"
          :label="$t('common.external-cell.hash')"
          :value="extractExternal.hash"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Params from '@/vue/common/Params'
import ClipboardField from '@/vue/fields/ClipboardField'

import { computed } from 'vue'
import { useCall, useExtrinsic } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'external-cell',

  components: { ClipboardField, Params },

  props: {
    hash: { type: Uint8Array, required: true },
  },

  setup (props) {
    const { extractExtrinsicState } = useExtrinsic()
    const proposal = useCall(
      api.derive.democracy.preimage,
      [props.hash],
      { transform: (val) => val.proposal },
    )

    const extractExternal = extractExtrinsicState({
      val: proposal,
      withHash: true,
    })
    const externalParamsWithValues = computed(() => {
      return proposal.value?.params.map((item, index) => {
        return {
          param: item,
          value: proposal.value.values[index],
        }
      })
    })

    return {
      proposal,
      extractExternal,
      externalParamsWithValues,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

</style>
