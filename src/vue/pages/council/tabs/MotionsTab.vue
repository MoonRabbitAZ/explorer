<template>
  <div class="motions-tab">
    <div class="motions-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('council-page.motions-tab.propose-motion-btn')"
        disabled
      />
      <app-button
        scheme="primary"
        :text="$t('council-page.motions-tab.propose-external-btn')"
        disabled
      />
      <app-button
        scheme="primary"
        :text="$t('council-page.motions-tab.cancel-slashes-btn')"
        disabled
      />
    </div>

    <motions-list
      :motions="motions"
      :members="members"
      :prime="prime"
      :is-member="isMember"
    />
  </div>
</template>

<script>
import MotionsList from '@council-page/tabs/motions/MotionsList'

import { useCall, useCollectiveMembers } from '@/vue/composables'
import { api } from '@api'

export default {
  name: 'motions-tab',

  components: {
    MotionsList,
  },

  setup () {
    const prime = useCall(api.derive.council.prime)
    const motions = useCall(api.derive.council.proposals)
    const { members, isMember } = useCollectiveMembers('council')

    return {
      prime,
      motions,
      members,
      isMember,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-tab { @include app-padding; }

.motions-tab__topbar {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}
</style>
