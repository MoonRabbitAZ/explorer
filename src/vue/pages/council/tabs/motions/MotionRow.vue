<template>
  <div class="motion-row">
    <!--  -->
  </div>
</template>

<script>

import { useVotingStatus } from '@council-page/composables/useVotingStatus'

export default {
  name: 'motions-row',

  setup (props) {
    const votingStatus = useVotingStatus()

    return {
      votingStatus,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.account-row__body {
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(2, 1fr) 15rem 11rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
}

</style>
