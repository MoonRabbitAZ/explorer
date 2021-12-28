<template>
  <div class="referendum-row">
    <p class="referendum-row__index">
      {{ $fnumber(referendum.index) }}
    </p>
    <div>
      <proposal-cell
        class="referendum-row__proposals"
        :image-hash="referendum.imageHash"
        :proposal="referendum.image?.proposal"
      />
    </div>
    <div>
      <template v-if="remainTime">
        <p class="referendum-row__time">
          {{ remainTime }}
        </p>
        <p>
          {{ $t('democracy-page.referendum-row.blocks-value', {
            count: $fnumber(remainBlock)
          }) }}
        </p>
      </template>
    </div>
    <div>
      <template v-if="enactTime">
        <p class="referendum-row__time">
          {{ enactTime }}
        </p>
        <p>
          {{ `#${$fnumber(enactBlock)}` }}
        </p>
      </template>
    </div>
    <div>
      <template v-if="isBoolean(referendum.isPassing)">
        <i
          v-tooltip="badgeTooltip"
          class="mdi referendum-row__badge-icon"
          :class="{
            'mdi-check': referendum.isPassing,
            'mdi-close': !referendum.isPassing,
            'referendum-row__badge-icon--passing': referendum.isPassing
          }"
        />
      </template>
    </div>
    <div>
      <app-button
        scheme="secondary"
        :text="$t('democracy-page.referendum-row.votes-btn')"
        @click="openVotes"
      />
    </div>
  </div>
</template>

<script>
import ProposalCell from '@council-page/tabs/motions/ProposalCell'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlockTime, useCall } from '@/vue/composables'
import { api } from '@api'
import { BN_ONE, isBoolean } from '@polkadot/util'

const EVENTS = {
  openVotes: 'open-votes',
}

export default {
  name: 'referendum-row',

  components: { ProposalCell },

  props: {
    referendum: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const { t } = useI18n()
    const { calculateTimeStr } = useBlockTime()
    const bestNumber = useCall(api.derive.chain.bestNumber)

    const enactBlock = computed(() =>
      props.referendum?.status.end.add(props.referendum.status.delay),
    )

    const remainBlock = computed(() => {
      if (!bestNumber.value || !props.referendum?.status) return null
      return props.referendum.status.end.sub(bestNumber.value).isub(BN_ONE)
    })

    const remainTime = computed(() => {
      if (!remainBlock.value) return null
      return calculateTimeStr(remainBlock.value, true)
    })

    const enactTime = computed(() => {
      if (!bestNumber.value || !enactBlock.value) return null
      return calculateTimeStr(enactBlock.value.sub(bestNumber.value), true)
    })

    const badgeTooltip = computed(() => {
      const threshold = props.referendum.status.threshold.type
        .toString()
        .replace('majority', ' majority ')

      return props.referendum.isPassing
        ? t('democracy-page.referendum-row.passing-badge-tooltip', {
          threshold,
        })
        : t('democracy-page.referendum-row.not-passing-badge-tooltip', {
          threshold,
        })
    })

    function openVotes () {
      emit(EVENTS.openVotes, props.referendum.index.toString())
    }

    return {
      remainTime,
      remainBlock,
      enactBlock,
      enactTime,
      isBoolean,
      badgeTooltip,
      openVotes,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.referendum-row {
  min-width: min-content;

  @include democracy-referendum-grid-row(center, 1rem);
  @include content-block;
}

.referendum-row__index {
  font-size: 1.6rem;
}

.referendum-row__time {
  margin-bottom: 1rem;
}

.referendum-row__badge-icon {
  font-size: 2rem;
  color: $col-app-error;
  line-height: 1;

  &--passing {
    color: $col-app-accent;
  }
}
</style>
