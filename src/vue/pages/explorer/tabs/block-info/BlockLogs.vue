<template>
  <div class="block-logs">
    <h1 class="block-logs__title">
      {{ $t('title') }}
    </h1>
    <template v-if="sortedLogs.length">
      <div
        class="block-logs__log-wrap"
        v-for="(log, id) in sortedLogs"
        :key="id"
      >
        <expander
          class="block-logs__log-expander"
          :title="log.type"
        >
          <template #dropdown-main>
            <params
              v-if="log.paramsWithValues.length"
              :params="log.paramsWithValues"
            />
            <div v-else>
              {{ log.value }}
            </div>
          </template>
        </expander>
      </div>
    </template>
    <template v-else>
      <no-data-message
        is-secondary
        :message="$t('no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import Params from '@/vue/common/Params'
import Expander from '@/vue/common/Expander'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
import { getTypeDef, Raw, Struct, Tuple, Vec } from '@polkadot/types'

export default {
  name: 'block-logs',

  components: {
    Params,
    NoDataMessage,
    Expander,
  },

  props: {
    logs: { type: Array, required: true },
  },

  setup (props) {
    function formatU8a (item) {
      return {
        paramsWithValues: [{
          param: { type: getTypeDef('Bytes') },
          value: item.value,
        }],
        type: item.type.toString(),
      }
    }

    function formatStruct (struct) {
      const params = Object.entries(struct.value.Type).map(([name, value]) => ({
        name,
        type: getTypeDef(value),
      }))

      const values = struct.value.toArray()

      const paramsWithValues = params.map((item, index) => {
        return {
          param: item,
          value: values[index],
        }
      })

      return {
        paramsWithValues,
        type: struct.type.toString(),
      }
    }

    function formatTuple (tuple) {
      const params = tuple.value.Types.map((type) => ({
        type: getTypeDef(type),
      }))

      const values = tuple.value.toArray()

      const paramsWithValues = params.map((item, index) => {
        return {
          param: item,
          value: values[index],
        }
      })

      return {
        paramsWithValues,
        type: tuple.type.toString(),
      }
    }

    function formatVector (vector) {
      const type = getTypeDef(vector.value.Type)
      const params = vector.value.map((_, index) => ({
        name: `${index}`,
        type,
      }))

      const values = vector.value.toArray()

      const paramsWithValues = params.map((item, index) => {
        return {
          param: item,
          value: values[index],
        }
      })

      return {
        paramsWithValues,
        type: vector.type.toString(),
      }
    }

    const sortedLogs = computed(() => {
      return props.logs.map(item => {
        if (item.value instanceof Struct) {
          return formatStruct(item)
        } else if (item.value instanceof Tuple) {
          return formatTuple(item)
        } else if (item.value instanceof Vec) {
          return formatVector(item)
        } else if (item.value instanceof Raw) {
          return formatU8a(item)
        } else {
          return {
            paramsWithValues: [],
            value: item.value.toString().split(',').join(', '),
            type: item.type.toString(),
          }
        }
      })
    })

    return {
      sortedLogs,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-logs__title {
  margin-bottom: 2rem;
}

.block-logs__log-wrap {
  padding: 1.8rem 1.6rem;

  @include content-block;

  & + & {
    margin-top: 0.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "title": "Logs",
    "no-data-message": "No logs available"
  }
}
</i18n>
