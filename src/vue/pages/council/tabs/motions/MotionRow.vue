<template>
  <div class="motion-row">
    <p>
      {{ $fnumber(motion.votes.index) }}
    </p>
    <div>
      <!--  -->
    </div>
    <p>
      {{ $fnumber(motion.votes.threshold) }}
    </p>
    <div>
      <p>
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
        @click="openVotersInfo"
      />
      <template v-if="true">
        <app-button
          class="motion-row__button"
          scheme="secondary"
          mdi-icon-name="mdi-check"
        />
      </template>
      <template v-else>
        <app-button
          class="motion-row__button"
          scheme="secondary"
          mdi-icon-name="mdi-close"
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
  openVoters: 'open-voters',
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

    function openVotersInfo () {
      emit(EVENTS.openVoters, motion.value.hash.toHex())
    }

    return {
      votingStatus,
      votingEndTime,
      votes,
      openVotersInfo,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motion-row {
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(2, 1fr) 15rem 11rem 20rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
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

</style>
