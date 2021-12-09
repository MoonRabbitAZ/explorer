<template>
  <div class="external-cell">
    <template v-if="proposal">
      <div>
        <params
          :params="externalParamsWithValues"
          :registry="extractExternal.registry"
        />
      </div>
      <div>
        <clipboard-field
          class="external-cell__secondary-item"
          v-if="extractExternal.signature"
          :label="$t('common.external-cell.signature', {
            type: extractExternal.signatureType
              ? `(${extractExternal.signatureType })`
              : ''
          })"
          :value="extractExternal.signature"
        />
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
import { computed } from 'vue'
import { useCall, useExtrinsic } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'external-cell',

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

    const extractExternal = extractExtrinsicState(proposal)
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
