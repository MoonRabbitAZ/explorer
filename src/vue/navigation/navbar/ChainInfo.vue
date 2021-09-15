<template>
  <div
    class="chain-info"
    :class="{'chain-info--mobile': isMobile}"
  >
    <p class="chain-info__line">
      {{ systemChain }}
    </p>
    <p class="chain-info__line">
      {{ specDisplay }}
    </p>
    <p class="chain-info__line">
      {{ lastBlockNumber }}
    </p>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { computed } from 'vue'

export default {
  name: 'chain-info',

  props: {
    isMobile: { type: Boolean, default: false },
  },

  setup () {
    const store = useStore()

    const systemChain = computed(() => store.getters[vuexTypes.systemChain])
    const specDisplay = computed(() =>
      `${store.getters[vuexTypes.specName]}/${store.getters[vuexTypes.specVersion]}`,
    )
    const lastBlockNumber = computed(() =>
      `# ${store.getters[vuexTypes.lastBlockNumber]}`,
    )

    return {
      systemChain,
      specDisplay,
      lastBlockNumber,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.chain-info {
  text-align: right;

  &--mobile {
    text-align: left;

    .chain-info__line {
      font-size: 1.4rem;
      line-height: 2.2rem;
    }
  }
}

.chain-info__line {
  font-size: 1rem;
  line-height: 1.6rem;
}
</style>
