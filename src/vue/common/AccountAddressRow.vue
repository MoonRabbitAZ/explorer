<template>
  <div
    class="account-address-row"
    :class="{
      'account-address-row--accent': isAccentColor,
      'account-address-row--elipsis': isTextElipsis
    }"
  >
    <identity-icon
      class="account-address-row__icon"
      :size="iconSize"
      :account-address="accountAddress"
    />
    <div class="account-address-row__address-wrap">
      <p
        v-if="isNameDisplay && accountName"
        class="account-address-row__name"
      >
        {{ accountName }}
      </p>
      <p class="account-address-row__address">
        {{ accountAddress }}
      </p>
    </div>
  </div>
</template>

<script>
import IdentityIcon from '@/vue/common/IdentityIcon'

import { computed, ref } from 'vue'
import { getName } from '@/js/helpers/account-helper'

export default {
  name: 'account-address-row',

  components: { IdentityIcon },

  props: {
    accountAddress: { type: String, required: true },
    isNameDisplay: { type: Boolean, default: false },
    isAccentColor: { type: Boolean, default: false },
    isTextElipsis: { type: Boolean, default: false },
    iconSize: { type: String, default: 'medium' },
  },

  setup (props) {
    const isInfoOpen = ref(false)

    const accountName = computed(() => getName(props.accountAddress))

    return {
      isInfoOpen,
      accountName,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.account-address-row {
  max-width: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;

  &--accent {
    .account-address-row__name,
    .account-address-row__address {
      color: $col-app-accent;
    }
  }

  &--elipsis {
    .account-address-row__name,
    .account-address-row__address {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: normal;
    }
  }
}

.account-address-row__icon {
  margin-right: 1.5rem;
}

.account-address-row__address-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

.account-address-row__address {
  word-break: break-all;
  color: $col-app-text;
}

.account-address-row__name {
  margin-bottom: 1rem;
  color: $col-app-text;
}

</style>
