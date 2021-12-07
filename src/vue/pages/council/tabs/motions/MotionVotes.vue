<template>
  <div class="motions-votes">
    <template v-if="votes.ayes.length || votes.nays.length">
      <template v-if="votes.ayes.length">
        <expander
          class="motions-votes__expander"
          :title="$t('council-page.motions-votes.ayes-header', {
            count: ayesCount
          })"
          is-in-drawer
        >
          <template #secondary>
            <account-address
              v-for="accountId in votes.ayes"
              :key="accountId.toString()"
              :account-address="accountId.toString()"
            />
          </template>
        </expander>
      </template>

      <template v-if="votes.nays.length">
        <expander
          class="motions-votes__expander"
          :title="$t('council-page.motions-votes.nays-header', {
            count: naysCount
          })"
          is-in-drawer
        >
          <template #secondary>
            <account-address
              v-for="accountId in votes.nays"
              :key="accountId.toString()"
              :account-address="accountId.toString()"
            />
          </template>
        </expander>
      </template>
    </template>
    <template v-else>
      <no-data-message
        :message="$t('council-page.motions-votes.no-data-message')"
      />
    </template>
  </div>
</template>

<script>
import Expander from '@/vue/common/Expander'
import AccountAddress from '@/vue/common/AccountAddress'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { computed } from 'vue'
export default {
  name: 'motions-votes',

  components: {
    Expander,
    AccountAddress,
    NoDataMessage,
  },

  props: {
    votes: { type: Object, required: true },
    members: { type: Array, required: true },
  },

  setup (props) {
    const ayesCount = computed(() => {
      const threshold = props.votes.threshold.toNumber()

      return `${props.votes.ayes.length}${threshold ? `/${threshold}` : ''}`
    })

    const naysCount = computed(() => {
      const threshold = props.votes.threshold.toNumber()
      const max = props.members?.length
        ? (props.members.length - threshold) + 1
        : 0

      return `${props.votes.nays.length}${max ? `/${max}` : ''}`
    })

    return {
      ayesCount,
      naysCount,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-votes__expander {
  & + & {
    margin-top: 2rem;
  }
}

</style>
