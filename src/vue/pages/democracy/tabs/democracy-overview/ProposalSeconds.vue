<template>
  <div class="proposal-seconds">
    <div class="proposal-seconds__body">
      <app-button
        class="proposal-seconds__second"
        scheme="primary"
        :text="$t('democracy-page.proposal-seconds.second-btn')"
        disabled
      />
    </div>
    <expander
      class="proposal-seconds__expander"
      :title="$t('democracy-page.proposal-seconds.seconds-header', {
        count: seconding.length
      })"
      is-in-drawer
    >
      <template #secondary>
        <account-address
          v-for="(account, index) in seconding"
          :key="index"
          class="proposal-seconds__address"
          :account-address="account.toString()"
        />
      </template>
    </expander>
  </div>
</template>

<script>
import Expander from '@/vue/common/Expander'
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'

export default {
  name: 'proposal-seconds',

  components: { Expander, AccountAddress },

  props: {
    proposal: { type: Object, required: true },
  },

  setup (props) {
    const seconding = computed(() =>
      props.proposal.seconds.filter((_, index) => index),
    )

    return { seconding }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.proposal-seconds__body {
  padding: 0 $drawer-padding;
}

.proposal-seconds__second {
  width: 100%;
  margin-bottom: 3rem;
}

.proposal-seconds__address {
  & + & {
    margin-top: 1.6rem;
  }
}
</style>
