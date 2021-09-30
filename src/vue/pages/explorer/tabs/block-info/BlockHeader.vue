<template>
  <div class="block-header">
    <div class="block-header__content">
      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-number') }}
        </h5>
        <p class="block-header__block-number">
          {{ blockNumber }}
        </p>
      </div>

      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-hash') }}
        </h5>
        <p class="block-header__item-value">
          {{ blockHash }}
        </p>
      </div>

      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-validator') }}
        </h5>
        <template v-if="header?.author">
          <account-address :account-address="header.author.toString()" />
        </template>
      </div>

      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-parent') }}
        </h5>
        <router-link
          class="block-header__item-value"
          :to="{
            ...$routes.blockInfoTab,
            query: {
              blockIdent: parentHash,
            }
          }"
        >
          {{ parentHash }}
        </router-link>
      </div>

      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-extrinsic') }}
        </h5>
        <p class="block-header__item-value">
          {{ extrinsicHash }}
        </p>
      </div>

      <div class="block-header__info-item">
        <h5 class="block-header__item-header">
          {{ $t('explorer-page.block-header.header-condition') }}
        </h5>
        <p class="block-header__item-value">
          {{ conditionHash }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'

import { toRefs, computed } from 'vue'

export default {
  name: 'block-header',

  components: { AccountAddress },

  props: {
    header: { type: Object, required: true },
  },

  setup (props) {
    const { header } = toRefs(props)

    const blockNumber = computed(() => header.value.number.unwrap().toNumber())
    const blockHash = computed(() => header.value.hash.toHex())
    const parentHash = computed(() => header.value?.parentHash.toHex() || '')
    const extrinsicHash = computed(() => header.value?.extrinsicsRoot.toHex())
    const conditionHash = computed(() => header.value?.stateRoot.toHex())

    return {
      blockNumber,
      blockHash,
      parentHash,
      extrinsicHash,
      conditionHash,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-header {
  padding: 2rem 1.6rem;

  @include content-block;
  @include respond-to($sidebar-hide-bp) {
    padding: 1.6rem;
  }
}

.block-header__content {
  display: grid;
  grid-gap: 1.6rem 3rem;
  grid-template-columns: min-content repeat(5, 1fr);
  max-width: 100%;
  width: 100%;

  @include respond-to($sidebar-hide-bp) {
    grid-template-columns: 1fr;
  }
}

.block-header__info-item {
  max-width: 100%;
  overflow: hidden;
  display: grid;
  grid-gap: 1rem 0;
  grid-template-rows: max-content 1fr;
  align-items: center;
}

.block-header__item-header {
  color: $col-app-secondary;
}

.block-header__block-number {
  font-size: 2rem;
  color: $col-app-accent;
}

.block-header__item-value {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
