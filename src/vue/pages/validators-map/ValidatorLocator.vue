<template>
  <div
    class="validator-locator"
    :style="{ 'left': `${positionLeft}px`, 'top': `${positionTop}px` }"
  >
    <div
      v-if="isPinged"
      class="validator-locator__ping"
    />
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'

const MIN_DELAY = 1 // seconds
const MAX_DELAY = 5 // seconds
const PING_ANIMATION_DURATION = 1000 // milliseconds

export default {
  name: 'validator-locator',

  props: {
    positionLeft: { type: [String, Number], required: true }, // pixels
    positionTop: { type: [String, Number], required: true }, // pixels
  },

  setup () {
    const isPinged = ref(false)
    let hidePingTimeoutId

    function getRandomDelay () {
      const rand = MIN_DELAY + Math.random() * (MAX_DELAY + 1 - MIN_DELAY)
      return Math.floor(rand * 1000)
    }

    function tryPing () {
      isPinged.value = true
      if (hidePingTimeoutId) clearTimeout(hidePingTimeoutId)

      hidePingTimeoutId = setTimeout(_ => {
        isPinged.value = false
      }, PING_ANIMATION_DURATION)
    }

    let pingTimeout = setTimeout(function runPingTimeout () {
      tryPing()
      clearTimeout(pingTimeout)

      pingTimeout = setTimeout(runPingTimeout, getRandomDelay())
    }, getRandomDelay())

    onBeforeUnmount(() => clearTimeout(pingTimeout))

    return {
      isPinged,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.validator-locator {
  width: 1rem;
  height: 1rem;
  background: transparent;
  border: 0.2rem solid $col-validator-locator-border;
  border-radius: 0.6rem;
  margin-left: -0.4rem;
  margin-top: -0.4rem;
  position: absolute;
}

.validator-locator__ping {
  position: absolute;
  border: 0.1rem solid $col-validator-locator-ping-border;
  border-radius: 3rem;
  opacity: 0;
  animation: ping 1s forwards;
}

@keyframes ping {
  from {
    left: -0.1rem;
    top: -0.1rem;
    width: 0.6rem;
    height: 0.6rem;
    border-width: 0.1rem;
    border-color: $col-validator-locator-ping-border;
    opacity: 1;
  }

  to {
    left: -1.8rem;
    top: -1.8rem;
    width: 4rem;
    height: 4rem;
    border-width: 0.1rem;
    border-color: $col-validator-locator-ping-border;
    opacity: 0;
  }
}

</style>
