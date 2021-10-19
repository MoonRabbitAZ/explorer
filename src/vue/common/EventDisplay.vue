<template>
  <expander
    :title="`${event.section}.${event.method}`"
    :subtitle="metaString"
  >
    <template #dropdown-main>
      <params
        :params="paramsWithValues"
      />
    </template>
  </expander>
</template>

<script>
import Expander from '@/vue/common/Expander'
import Params from '@/vue/common/Params'

import { computed } from 'vue'
import { getTypeDef, GenericEvent } from '@polkadot/types'
import { formatMetaPartsToString } from '@/js/helpers/blockchain-event-helper'

export default {
  name: 'event-display',

  components: {
    Expander,
    Params,
  },

  props: {
    event: { type: GenericEvent, required: true },
  },

  setup (props) {
    const paramsWithValues = computed(() => {
      return props.event.typeDef.map(({ type }, index) => {
        return {
          param: { type: getTypeDef(type) },
          value: props.event.data[index],
        }
      })
    })

    const metaString = computed(() => formatMetaPartsToString(props.event.meta))

    return {
      paramsWithValues,
      metaString,
    }
  },
}
</script>
