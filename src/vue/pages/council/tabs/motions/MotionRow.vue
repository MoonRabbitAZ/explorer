<template>
  <div class="motion-row">
    <p class="motion-row__index">
      {{ $fnumber(motion.votes.index) }}
    </p>
    <div>
      <!--  -->
    </div>
    <p>
      {{ $fnumber(motion.votes.threshold) }}
    </p>
    <div>
      <p class="motion-row__time">
        {{ votingEndTime }}
      </p>
      <p>
        {{ `#${$fnumber(votes.end)}` }}
      </p>
    </div>
    <div class="motion-row__actions">
      <app-button
        class="motion-row__button"
        scheme="secondary"
        :text="'Votes'"
        @click="openVotesInfo"
      />
      <template v-if="true">
        <app-button
          class="motion-row__button"
          scheme="secondary"
          mdi-icon-name="mdi-check"
          disabled
        />
      </template>
      <template v-else>
        <app-button
          class="motion-row__button"
          scheme="secondary"
          mdi-icon-name="mdi-close"
          disabled
        />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, toRefs } from 'vue'
import { useBlockTime } from '@/vue/composables'
import { useVotingStatus } from '@council-page/composables/useVotingStatus'

const EVENTS = {
  openVotes: 'open-votes',
}

export default {
  name: 'motions-row',

  props: {
    motion: { type: Object, required: true },
    members: { type: Array, default: null },
    prime: { type: Object, default: null },
    isMember: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { calculateTimeStr } = useBlockTime()
    const { motion, members } = toRefs(props)
    const votes = computed(() => motion.value.votes)
    const section = ref('council')
    const votingStatus = useVotingStatus(votes, members, section)

    const votingEndTime = computed(() => {
      if (!votingStatus.value.remainingBlocks) return null
      return calculateTimeStr(votingStatus.value.remainingBlocks, true)
    })

    function openVotesInfo () {
      emit(EVENTS.openVotes, motion.value.hash.toHex())
    }

    return {
      votingStatus,
      votingEndTime,
      votes,
      openVotesInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motion-row {
  @include councils-motions-grid-row(center, 1rem);
  @include content-block;
}

.motion-row__index {
  font-size: 1.6rem;
}

.motion-row__actions {
  display: flex;
  justify-content: flex-end;
}

.motion-row__button {
  & + & {
    margin-left: 1rem;
  }
}

.motion-row__time {
  margin-bottom: 1rem;
}

</style>
