<template>
  <expander :title="title">
    <template #subtitle>
      <button
        type="button"
        @click.stop="toBlockInfo"
        class="recent-event__link-button"
      >
        {{ eventBlockNumber }}
      </button>

      <router-link
        :to="{
            ...$routes.blockInfoTab,
            query: {
              blockIdent: event.blockHash,
            }
        }"
      />
    </template>

    <template #description>
      {{ metaString }}
    </template>

    <template #dropdown-main>
      <params :params="paramsWithValues"/>
    </template>
  </expander>
</template>

<script>
import Expander from '@/vue/common/Expander'
import Params from '@/vue/common/Params'

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { vueRoutes } from '@/vue-router'
import { getTypeDef } from '@polkadot/types'
import { formatMetaPartsToString } from '@/js/helpers/blockchain-event-helper'
import { formatNumber } from '@polkadot/util'
import { EventWrapperRecord } from '@/js/records/event-wrapper.record'

export default {
  name: 'recent-event',

  components: {
    Expander,
    Params,
  },

  props: {
    event: { type: EventWrapperRecord, required: true },
  },

  setup (props) {
    const router = useRouter()

    const paramsWithValues = computed(() => {
      const eventParams = props.event.record.event.typeDef.map(({ type }) =>
        ({ type: getTypeDef(type) }))
      return eventParams.map((item, index) => {
        return {
          param: item,
          value: props.event.record.event.data[index],
        }
      })
    })

    const metaString = computed(() =>
      formatMetaPartsToString(props.event.record.event.meta),
    )

    const eventBlockNumber = computed(() => {
      return `${formatNumber(props.event.blockNumber)}-${props.event.indexes[0]}`
    })

    const title = computed(() =>
      `${props.event.record.event.section}.${props.event.record.event.method}`,
    )

    function toBlockInfo () {
      router.push({
        ...vueRoutes.blockInfoTab,
        query: {
          blockIdent: props.event.blockHash,
        },
      })
    }

    return {
      title,
      paramsWithValues,
      metaString,
      eventBlockNumber,
      toBlockInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

.recent-event__link-button {
  @include link-primary;
}
</style>
