<template>
  <div class="params">
    <div
      class="params__wrap"
      v-if="params.length"
    >
      <param-viewer
        class="params__item-viewer"
        v-for="(item, index) in params"
        :key="index"
        :parameter="item.param"
        :info-value="item.value"
      />
    </div>
  </div>
</template>

<script>
import ParamViewer from '@/vue/common/ParamViewer'

export default {
  name: 'params',

  components: {
    ParamViewer,
  },

  props: {
    /**
     * @param {Array} params - array of objects
     * [
     *  {
     *    param: {}, Object
     *    value: "", Object, Array, String, Number, null, undefined,
     *  }
     * ]
     */
    params: { type: Array, default: _ => ([]) },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.params__item-viewer {
  & + & {
    margin-top: 1.6rem;
  }
}
</style>
