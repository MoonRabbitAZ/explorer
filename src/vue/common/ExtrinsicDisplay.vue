<template>
  <div
    class="extrinsic-display"
  >
    <expander
      :title="`${extractExtrinsic.section}.${extractExtrinsic.method}`"
      :meta="extractExtrinsic.meta"
    >
      <template #dropdown-main>
        <params
          :params="extrinsicParamsWithValues"
        />
      </template>

      <template #secondary>
        <clipboard-field
          class="extrinsic-display__secondary-item"
          v-if="extractExtrinsic.signature"
          :label="$t('signature', {
            type: extractExtrinsic.signatureType
              ? `(${extractExtrinsic.signatureType })`
              : ''
          })"
          :value="extractExtrinsic.signature"
        />
        <clipboard-field
          v-if="extractExtrinsic.hash"
          class="extrinsic-display__secondary-item"
          :label="$t('hash')"
          :value="extractExtrinsic.hash"
        />
        <param-viewer
          v-if="extractExtrinsic.isSigned"
          class="extrinsic-display__secondary-item"
          :label="$t('lifetime')"
          :string-value="era.length
            ? $t('mortal', {
              startAt: era[0],
              endsAt: era[1],
            })
            : $t('immortal')
          "
        />
      </template>
    </expander>
  </div>
</template>

<script>
import Expander from '@/vue/common/Expander'
import Params from '@/vue/common/Params'
import ParamViewer from '@/vue/common/ParamViewer'
import ClipboardField from '@/vue/fields/ClipboardField'

import { computed, toRefs } from 'vue'

export default {
  name: 'extrinsic-display',

  components: {
    Expander,
    Params,
    ClipboardField,
    ParamViewer,
  },

  props: {
    extractExtrinsic: { type: Object, required: true },
    blockNumber: { type: Number, required: true },
  },

  setup (props) {
    const { extractExtrinsic, blockNumber } = toRefs(props)

    const era = computed(() => {
      const era = extractExtrinsic.value.era
      return blockNumber.value && era.isMortalEra
        ? [
            era.asMortalEra.birth(blockNumber.value),
            era.asMortalEra.death(blockNumber.value),
          ]
        : []
    })

    const extrinsicParamsWithValues = computed(() => {
      return props.extractExtrinsic.params.map((item, index) => {
        return {
          param: item,
          value: props.extractExtrinsic.values[index],
        }
      })
    })

    return {
      era,
      extrinsicParamsWithValues,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.extrinsic-display__secondary-item {
  margin-top: 1.6rem;
}
</style>

<i18n>
{
  "en": {
    "signature": "Signature { type }",
    "hash": "Hash",
    "lifetime": "Lifetime",
    "mortal": "Mortal, valid from #{ startAt } to #{ endsAt }",
    "immortal": "Immortal"
  }
}
</i18n>
