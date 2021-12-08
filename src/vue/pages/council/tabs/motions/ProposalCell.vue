<template>
  <div class="proposal-cell">
    <call-expander :extrinsic="proposal" />
  </div>
</template>

<script>
import CallExpander from '@/vue/common/CallExpander'

export default {
  name: 'proposal-cell',

  components: {
    CallExpander,
  },

  props: {
    imageHash: { type: Uint8Array, required: true },
    proposal: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

</style>
