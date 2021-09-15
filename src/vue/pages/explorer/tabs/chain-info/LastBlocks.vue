<template>
  <div class="last-blocks">
    <h2 class="last-blocks__title app__big-title">
      {{ $t('title') }}
    </h2>
    <template v-if="lastHeaders.length">
      <div class="last-blocks__body">
        <div
          v-for="item in lastHeaders"
          class="last-blocks__row app__content-block"
          :key="item.number"
        >
          <router-link
            class="last-blocks__row-number-link"
            :to="{
            ...$routes.blockInfoTab,
            query: {
              blockIdent: item.hash.toHex(),
            }
            }"
          >
            {{ item.number }}
          </router-link>
          <span class="last-blocks__row-block-id">
            {{ item.hash.toHex() }}
          </span>
          <span class="last-blocks__row-account">
            {{ getAddress(item.author) }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="last-blocks__no-data-message app__content-block">
        {{ $t('no-data-message') }}
      </div>
    </template>
  </div>
</template>

<script>
import { getAddress } from '@/js/helpers/account-helper'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'last-blocks',

  setup () {
    const store = useStore()
    const lastHeaders = computed(() => {
      return store.getters[vuexTypes.lastHeaders]
    })

    return {
      lastHeaders,
      getAddress,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.last-blocks__title {
  margin-bottom: 2rem;
}

.last-blocks__body {
  max-height: 50vh;
  overflow-x: auto;

  @include scrollbar;
}

.last-blocks__row {
  display: grid;
  grid-template-columns: max-content 0.7fr 0.3fr;
  grid-gap: 1.4rem;
  align-items: center;
  height: 5.2rem;
  padding: 0 1.6rem;

  & + & {
    margin-top: 0.4rem;
  }
}

.last-blocks__row-number-link {
  font-size: 1.6rem;
  color: $col-app-accent;
}

.last-blocks__row-account,
.last-blocks__row-block-id {
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-blocks__row-account {
  color: $col-app-accent;
}

.last-blocks__no-data-message {
  height: 5.2rem;
  padding: 0 1.6rem;
  color: $col-app-no-data;
  display: flex;
  align-items: center;
}

</style>

<i18n>
{
  "en": {
    "title": "Last blocks",
    "no-data-message": "No blocks available"
  }
}
</i18n>
