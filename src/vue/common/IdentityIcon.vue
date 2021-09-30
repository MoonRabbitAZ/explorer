<template>
  <div
    class="identity-icon"
    :class="[`identity-icon--${size}`]"
  >
    <img
      class="identity-icon__img"
      :src="imgPath"
      :alt="$t('common.identity-icon.identity-img')"
    >
  </div>
</template>

<script>

import { computed } from 'vue'
import { decodeAddress } from '@polkadot/util-crypto'
import { isString } from '@polkadot/util'

const ACCOUNT_IMAGES = [
  '/static/images/oracle/oracle2.png',
  '/static/images/oracle/oracle1.png',
  '/static/images/oracle/oracle3.png',
  '/static/images/oracle/oracle4.png',
  '/static/images/oracle/oracle5.png',
  '/static/images/oracle/oracle6.png',
  '/static/images/oracle/oracle7.png',
  '/static/images/oracle/oracle8.png',
  '/static/images/oracle/oracle9.png',
  '/static/images/oracle/oracle10.png',
  '/static/images/oracle/oracle11.png',
]

const SIZE = {
  big: 'big',
  medium: 'medium',
  small: 'small',
}

export default {
  name: 'identity-icon',

  props: {
    accountAddress: { type: [String, Uint8Array], required: true },
    size: { type: String, default: SIZE.medium },
  },

  setup (props) {
    const imgPath = computed(() => {
      const unit8ArrayAddress = isString(props.accountAddress)
        ? decodeAddress(props.accountAddress)
        : props.accountAddress

      const imgIndex = unit8ArrayAddress.reduce((acc, item) => acc + item, 0) %
        ACCOUNT_IMAGES.length
      return ACCOUNT_IMAGES[imgIndex]
    })

    return {
      imgPath,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.identity-icon {
  border-radius: 50%;

  &--big {
    min-width: 5rem;
    width: 5rem;
    height: 5rem;
  }

  &--medium {
    min-width: 3.2rem;
    width: 3.2rem;
    height: 3.2rem;
  }

  &--small {
    min-width: 2.4rem;
    width: 2.4rem;
    height: 2.4rem;
  }
}

.identity-icon__img {
  width: 100%;
  height: 100%;
}

</style>
