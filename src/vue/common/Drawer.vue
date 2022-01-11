<template>
  <transition name="drawer-transition">
    <div class="drawer" v-if="isShown">
      <div
        class="drawer__backdrop"
        @click="closeByClickOutside ? closeSelf() : ''"
      />
      <div class="drawer__pane">
        <div class="drawer__head">
          <h2 class="drawer__heading">
            <slot name="heading" />
          </h2>
          <button class="drawer__close-btn" @click="closeSelf">
            <i class="mdi mdi-close drawer__close-icon" />
          </button>
        </div>
        <div
          class="drawer__body"
          :class="{'drawer__body--default': isDefaultBody}"
        >
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, onBeforeUnmount } from 'vue'

const EVENTS = {
  updateIsShown: 'update:isShown',
}

const HTML_CLASS_NAME = 'fixed'

/**
 * Drawer component serves as a wrapper for modal content.
 *
 * To use it pass your content as a slot inside anda sync it's prop with the
 * data field in your parent component:
 *
 * <drawer v-model:is-shown="isContentShown">
 *    <content>
 * </drawer>
 *
 * As long as `isContentShown` is `true`, your content will be displayed.
 */
export default {
  props: {
    isShown: { type: Boolean, default: true },
    closeByClickOutside: { type: Boolean, default: true },
    isDefaultBody: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const isOtherDrawerShown = ref(false)
    const closeSelf = () => emit(EVENTS.updateIsShown, false)
    const el = document.getElementsByTagName('html')[0]

    function toggleHtmlClass (isDrawerShown) {
      if (isDrawerShown) {
        if (el.classList.contains(HTML_CLASS_NAME)) {
          isOtherDrawerShown.value = true
        } else {
          el.classList.add(HTML_CLASS_NAME)
        }
      } else if (!isOtherDrawerShown.value) {
        el.classList.remove(HTML_CLASS_NAME)
      }
    }

    watch(() => props.isShown, toggleHtmlClass)
    onBeforeUnmount(() => { el.classList.remove(HTML_CLASS_NAME) })
    return {
      closeSelf,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

$media-small: 460px;

.drawer {
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  z-index: $z-drawer;
  overflow: hidden;
}

.drawer__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $col-drawer-backdrop-bg;
  z-index: $z-drawer-backdrop;
}

.drawer__close-btn {
  width: 4.5rem;
  min-width: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer__close-icon {
  display: flex;
  font-size: 2.4rem;
  line-height: 1;

  &:before {
    font-weight: 700;
    vertical-align: middle;
  }
}

.drawer__pane {
  position: absolute;
  top: 0;
  right: 0;
  width: 33rem;
  max-width: 100%;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer__head {
  height: $app-navbar-height;
  padding: 0 $drawer-padding;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $col-app-block-bg;

  @include respond-to-height($media-small) {
    padding: 1rem 1.5rem;
  }
}

.drawer__heading {
  color: $col-app-text;
}

.drawer__body {
  padding: $drawer-padding;
  background-color: $col-app-block-bg;
  flex: 1;

  // allows to scroll drawer content when it height more than drawer height
  overflow-y: auto;
  height: 0;

  @include scrollbar;

  &--default {
    background-color: $col-app-bg;
    padding: $drawer-padding 0;
  }
}

.drawer-transition-enter-active {
  animation-duration: 0.13s;

  /*
    Disabled because with this nesting we can shiny see where this animation
    used
  */
  /* stylelint-disable selector-nested-pattern */
  & > .drawer__backdrop {
    animation: drawer-backdrop-keyframes 0.2s ease-in-out;
  }

  & > .drawer__pane {
    animation: drawer-pane-keyframes 0.2s ease-in-out;
  }
  /* stylelint-enable selector-nested-pattern */
}

.drawer-transition-leave-active {
  /*
    overall duration should be less than nested durations,
    to prevent animation flickering after animation ended
    but the element still present
  */
  animation-duration: 0.13s;

  /*
    Disabled because with this nesting we can shiny see where this animation
    used
  */
  /* stylelint-disable selector-nested-pattern */
  & > .drawer__backdrop {
    animation: drawer-backdrop-keyframes 0.2s ease-in-out reverse;
  }

  & > .drawer__pane {
    animation: drawer-pane-keyframes 0.2s ease-in-out reverse;
  }
  /* stylelint-enable selector-nested-pattern */
}

@keyframes drawer-backdrop-keyframes {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes drawer-pane-keyframes {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
