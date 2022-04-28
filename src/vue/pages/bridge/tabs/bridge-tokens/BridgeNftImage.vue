<template>
  <div class="bridge-nft-image">
    <skeleton-loader
      v-if="!isLoadFailed"
      class="bridge-nft-image__skeleton"
    />
    <img
      class="bridge-nft-image__img"
      :src="imgUrl"
      @error="isLoadFailed = true"
      alt="Token image"
    >
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { ref } from 'vue'

export default {
  name: 'bridge-nft-image',

  components: { SkeletonLoader },

  props: {
    imgUrl: { type: String, required: true },
  },

  setup () {
    const isLoadFailed = ref(false)

    return { isLoadFailed }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

$z-bridge-nft-image-skeleton: -1;

.bridge-nft-image {
  position: relative;
  width: 15.4rem;
  height: 15.4rem;
  border-radius: 1.2rem;
  overflow: hidden;
  border: 0.1rem solid $col-app-accent;
}

.bridge-nft-image__skeleton {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: $z-bridge-nft-image-skeleton;
}

.bridge-nft-image__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
