<template>
  <div class="my-my-contributors-expander">
    <div
      class="my-contributors-expander__my-contributors"
      :class="{
        'my-contributors-expander__my-contributors--open': isOpenDropdown
      }"
    >
      <button
        class="my-contributors-expander__my-contributors-btn"
        type="button"
        @click="toggleOpenDropdown"
      >
        <h3>
          <!-- eslint-disable-next-line max-len -->
          {{ $t('parachains-page.my-contributors-expander.my-contributors-header', {
            count: contributors.length,
          }) }}
        </h3>
        <i
          class="
            mdi
            mdi-chevron-down
            my-contributors-expander__my-contributors-btn-icon
          "
        />
      </button>
      <div
        ref="dropdown"
        class="my-contributors-expander__my-contributors-dropdown"
      >
        <div
          v-for="account in contributors"
          :key="account.accountAddress"
          class="my-contributors-expander__my-contributor"
        >
          <account-address
            class="my-contributors-expander__my-contributor-account"
            :account-address="account.accountAddress"
          />
          <div class="my-contributors-expander__account-contribution">
            <template v-if="account.contribution">
              {{ $fbalance(account.contribution) }}
            </template>
            <template v-else>
              <skeleton-loader
                class="my-contributors-expander__account-contribution-loader"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { ref } from 'vue'

export default {
  name: 'my-contributors-expander',

  components: { AccountAddress, SkeletonLoader },

  props: {
    contributors: { type: Array, required: true },
  },

  setup () {
    const dropdown = ref(null)
    const isOpenDropdown = ref(false)

    function toggleOpenDropdown () {
      if (isOpenDropdown.value) {
        dropdown.value.style.height = '0px'
      } else {
        dropdown.value.style.height = `${dropdown.value.scrollHeight}px`
      }

      isOpenDropdown.value = !isOpenDropdown.value
    }

    return {
      dropdown,
      isOpenDropdown,
      toggleOpenDropdown,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.my-contributors-expander__my-contributors {
  margin-top: 3rem;
  padding: 0 $drawer-padding;
  background: $col-app-block-bg;

  &--open {
    .my-contributors-expander__my-contributors-btn-icon {
      transform: rotate(180deg);
    }

    .my-contributors-expander__my-contributors-dropdown {
      opacity: 1;
    }
  }
}

.my-contributors-expander__my-contributors-btn {
  padding: 1.6rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.my-contributors-expander__my-contributors-btn-icon {
  font-size: 2.4rem;
  line-height: 1;
  transform: rotate(0);
  transition: 0.2s all linear;
}

.my-contributors-expander__my-contributor {
  display: grid;
  grid-gap: 0 1.6rem;
  grid-template-columns: 1fr 12rem;
  align-items: center;
  justify-items: flex-end;
  margin-bottom: 1.6rem;
}

.my-contributors-expander__my-contributors-dropdown {
  opacity: 0;
  height: 0;
  overflow: hidden;
  margin-top: 0;
  transition: 0.2s all linear;
}

.my-contributors-expander__account-contribution-loader {
  height: 2rem;
}
</style>
