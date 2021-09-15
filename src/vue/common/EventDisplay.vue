<template>
  <expander
    :title="`${event.section}.${event.method}`"
    :meta="event.meta"
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
      const eventParams =
        props.event.typeDef.map(({ type }) => ({ type: getTypeDef(type) }))
      return eventParams.map((item, index) => {
        return {
          param: item,
          value: props.event.data[index],
        }
      })
    })

    return {
      paramsWithValues,
    }
  },
}
</script>
