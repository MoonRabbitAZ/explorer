<template>
  <div
    class="param-viewer"
  >
    <p class="param-viewer__name">
      {{ title }}
    </p>
    <template v-if="stringValue">
      <p class="param-viewer__info-string">
        {{ stringValue }}
      </p>
    </template>
    <template v-else>
      <pre class="param-viewer__info">{{ stringInfoValue }}</pre>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { isUndefined } from '@polkadot/util'
import { encodeTypeDef, TypeRegistry } from '@polkadot/types/create'

import isEmpty from 'lodash/isEmpty'
export default {
  name: 'param-viewer',

  props: {
    parameter: { type: Object, default: _ => ({}) },
    label: { type: String, default: '' },
    infoValue: {
      type: [Object, Array, String, Number, null, undefined],
      default: '',
    },
    stringValue: { type: String, default: '' },
    registry: { type: TypeRegistry, default: undefined },
  },

  setup (props) {
    const stringInfoValue = computed(() =>
      JSON.stringify(props.infoValue, null, 2).replace(/["\\]/g, ''),
    )

    const title = computed(() => {
      return isEmpty(props.parameter)
        ? props.label
        : isUndefined(props.parameter?.name)
          ? encodeTypeDef(props.registry, props.parameter.type)
          : `${props.parameter.name}: ${encodeTypeDef(props.registry, props.parameter.type)}`
    })

    return {
      title,
      stringInfoValue,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.param-viewer__name {
  margin-bottom: 0.8rem;
  color: $col-app-secondary;
}
</style>
