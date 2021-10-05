<template>
  <transition name="status-message__transition">
    <div
      v-if="isShown"
      class="status-message"
      :class="[
        `status-message--${messageType}`,
        { 'status-message--jump': isShownAgain }
      ]"
      @mouseenter="stopProgressBar"
      @mouseleave="startProgressBar"
    >
      <div class="status-message__body">
        <div class="status-message__top-bar">
          <h2 class="status-message__title">
            <icon
              class="status-message__icon"
              :class="[`status-message__icon--${messageType}`]"
              :name="messageIconName"
            />
            {{ $t(`common.status-message.title_${messageType}`) }}
          </h2>
          <button
            type="button"
            @click="isShown = false"
            class="status-message__close-btn"
          />
        </div>
        <p class="status-message__text">
          {{ $t(`${messageId}`, { context: messageType, ...messageArgs}) }}
        </p>
      </div>
      <div
        v-if="messageType !== MESSAGE_TYPES.processing"
        class="status-message__progress-bar"
      >
        <span
          class="status-message__progress-bar-percentage"
          :style="{ 'width': getInvertedProgressPercents + '%' }"
          :class="`status-message__progress-bar-percentage--${messageType}`"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import Icon from '@/vue/common/Icon'
import { Bus } from '@/js/helpers/event-bus'

const DEFAULT_MESSAGE_TRANSLATION_ID = 'common.status-message.default-message'
const CLOSE_TIMEOUT_MS = 7500
const SHOWN_AGAIN_PRESENCE_TIMEOUT_MS = 1000
const ONE_HUNDRED_PERCENTS = 100
const MAX_ANIMATION_PROGRESS = 1
const MIN_ANIMATION_PROGRESS = 0

const MESSAGE_TYPES = Object.freeze({
  success: 'success',
  error: 'error',
  processing: 'processing',
  info: 'info',
})

export default {
  name: 'status-message',

  components: { Icon },

  data: _ => ({
    messageTitleId: '',
    messageType: '',
    messageId: '',
    messageArgs: {},
    isShown: false,
    isShownAgain: false,
    isShownAgainTimeoutId: -1,
    animationFrame: -1,
    progressBar: {
      progress: 0,
      paused: false,
    },
    DEFAULT_MESSAGE_TRANSLATION_ID,
    MESSAGE_TYPES,
  }),

  computed: {
    messageIconName () {
      switch (this.messageType) {
        case MESSAGE_TYPES.success:
          return 'success'
        case MESSAGE_TYPES.error:
          return 'alert'
        case MESSAGE_TYPES.info:
          return 'info'
        case MESSAGE_TYPES.processing:
          return 'rotate'
        default:
          return ''
      }
    },

    getInvertedProgressPercents () {
      const animationProgressPercents =
        this.progressBar.progress * ONE_HUNDRED_PERCENTS

      const animationProgressPercentsInverted =
        ONE_HUNDRED_PERCENTS - animationProgressPercents

      return animationProgressPercentsInverted
    },
  },

  created () {
    Bus.on(Bus.eventList.success, payload =>
      this.show(MESSAGE_TYPES.success, payload))
    Bus.on(Bus.eventList.error, payload =>
      this.show(MESSAGE_TYPES.error, payload))
    Bus.on(Bus.eventList.info, payload =>
      this.show(MESSAGE_TYPES.info, payload))
    Bus.on(Bus.eventList.processing, payload =>
      this.show(MESSAGE_TYPES.processing, payload))
  },

  unmounted () {
    cancelAnimationFrame(this.animationFrame)
  },

  methods: {
    show (messageType, payload) {
      this.messageType = messageType

      if (typeof payload === 'string') {
        this.messageId = payload
      } else if (this.isObject(payload)) {
        this.messageId = payload.messageId ||
          `${DEFAULT_MESSAGE_TRANSLATION_ID}_${this.messageType}`
        this.messageArgs = payload.messageArgs || {}
      } else {
        this.messageId = `${DEFAULT_MESSAGE_TRANSLATION_ID}_${this.messageType}`
      }

      cancelAnimationFrame(this.animationFrame)

      if (this.isShown) {
        this.doJump()
        this.progressBar.progress = MIN_ANIMATION_PROGRESS
      } else {
        this.isShown = true
      }

      if (messageType !== MESSAGE_TYPES.processing) this.startAnimationTimeout()
    },

    startAnimationTimeout (currentAnimationTime = 0) {
      const animationStartTime = performance.now()
      const calculateAnimationProgress = () => {
        this.animationFrame = requestAnimationFrame((timestamp) => {
          if (this.progressBar.paused) {
            cancelAnimationFrame(this.animationFrame)
            return
          }

          const animationTime = currentAnimationTime - animationStartTime
          const animationRuntime = timestamp + animationTime
          const animationProgress = animationRuntime / CLOSE_TIMEOUT_MS

          if (animationRuntime < CLOSE_TIMEOUT_MS) {
            this.progressBar.progress = animationProgress
            calculateAnimationProgress()
          } else {
            this.progressBar.progress = MAX_ANIMATION_PROGRESS
            cancelAnimationFrame(this.animationFrame)
            this.isShown = false
          }
        })
      }
      calculateAnimationProgress()
    },

    doJump () {
      this.isShownAgain = true

      if (this.isShownAgainTimeoutId) {
        window.clearTimeout(this.isShownAgainTimeoutId)
      }

      this.isShownAgainTimeoutId = window.setTimeout(_ => {
        this.isShownAgain = false
      }, SHOWN_AGAIN_PRESENCE_TIMEOUT_MS)
    },

    stopProgressBar () {
      this.progressBar.paused = true
    },

    isObject (value) {
      return typeof value === 'object' && !Array.isArray(value) && !null
    },

    startProgressBar () {
      this.progressBar.paused = false
      const currentAnimationTime = CLOSE_TIMEOUT_MS * this.progressBar.progress

      this.startAnimationTimeout(currentAnimationTime)
    },
  },
}
</script>

<style lang="scss">
@import '~@/scss/variables';
@import '~@/scss/mixins';

$progress-bar-bg: rgba($col-app-accent, 0.2);

.status-message {
  @include box-shadow();
  position: fixed;
  right: 4rem;
  top: 4rem;
  z-index: $z-status-message;
  max-width: 42rem;
  min-width: 32rem;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: $col-app-block-bg;
  box-shadow: $col-status-shadow;

  &--jump {
    animation: status-message__transition-jump 0.25s ease-out;
  }

  @include respond-to($tablet) {
    min-width: auto;
  }
  @include respond-to($status-message-reposition-bp) {
    right: $content-side-paddings-sm;
    left: $content-side-paddings-sm;
  }
}

.status-message__progress-bar {
  position: relative;
  width: 100%;
  height: 0.2rem;
  margin-top: 2rem;
  border-radius: 0.4rem;
  background-color: $progress-bar-bg;
}

.status-message__progress-bar-percentage {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.2rem;
  width: 100%;
  background-color: $col-app-accent;
  max-width: 100%;
  border-radius: 0.4rem;
}

.status-message__top-bar {
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-bottom: 2rem;
}

.status-message__title {
  display: flex;
  align-items: center;
  color: $col-app-text;
}

.status-message__text {
  font-size: 1.2rem;
  line-height: 1.6rem;
  color: $col-app-text;
}

.status-message__icon {
  display: flex;
  width: 2rem;
  height: 2rem;
  margin-right: 1.2rem;
  color: $col-app-text;

  &--success {
    color: $col-app-accent;
  }

  &--error {
    color: $col-app-error;
  }

  &--processing {
    animation: rotate-process-icon 1s 1s ease-out infinite;
  }
}

.status-message__close-btn {
  position: relative;
  width: 2rem;
  align-self: stretch;
  background-color: transparent;
  display: block;

  /* cross */
  $cross-stroke-width: 0.2rem;
  $cross-stroke-height: 2rem;

  &:before,
  &:after {
    transition: 0.2s;

    content: '';
    position: absolute;
    height: $cross-stroke-height;
    width: $cross-stroke-width;
    top: calc(50% - (#{$cross-stroke-height} / 2));
    left: calc(50% - (#{$cross-stroke-width} / 2));
    background-color: $col-app-text;
  }

  &:before {
    transform: rotate(225deg);
  }

  &:after {
    transform: rotate(135deg);
  }
  /* /cross */
}

.status-message__transition-enter-active,
.status-message__transition-leave-active {
  transition: all 0.2s linear;
}

.status-message__transition-enter,
.status-message__transition-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}

@keyframes status-message__transition-jump {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
@keyframes rotate-process-icon {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
