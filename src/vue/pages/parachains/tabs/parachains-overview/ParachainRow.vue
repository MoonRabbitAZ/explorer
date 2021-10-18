<template>
  <div class="parachain-row">
    <p class="parachain-row__main-column">
      {{ $fnumber(parachainId) }}
    </p>
    <p class="parachain-row__main-column">
      {{ parachainName }}
    </p>
    <div>
      <app-button
        mdi-icon-name="mdi-information-outline"
        scheme="secondary"
        @click="clickButtonInfo"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { ENDPOINTS } from '@/js/const/endpoints.const'
import CONFIG from '@/config'

const EVENTS = { clickButtonInfo: 'click-button-info' }

export default {
  name: 'parachain-row',

  props: {
    parachainId: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    function clickButtonInfo () {
      emit(EVENTS.clickButtonInfo, props.parachainId)
    }

    const parachainName = computed(() => {
      const currentRelay = Object.values(ENDPOINTS).find((relay) =>
        Object.values(relay.providers).some((provider) =>
          provider === CONFIG.WSS_NODE,
        ),
      )
      const parachainInfo = currentRelay?.linked?.find(({ paraId }) => {
        return props.parachainId === paraId
      })

      return parachainInfo?.name
    })

    return { clickButtonInfo, parachainName }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachain-row {
  flex: 1;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 7rem 1fr min-content;
  align-items: center;
  padding: 1rem 1.6rem;
  min-height: 4.6rem;

  @include content-block;
}

.parachain-row__main-column {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.6rem;
}

.parachain-row__dropdown {
  margin-top: 1rem;
}
</style>
