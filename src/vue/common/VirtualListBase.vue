<template>
  <div ref="rootListBase" class="virtual-list-base">
    <template v-if="loading">
      <div
        class="virtual-list-base__loading"
        :class="{ 'virtual-list-base__loading--grid': gridTemplate }"
      >
        <!-- @slot Slot for loading state -->
        <slot name="loading-stub" />
      </div>
    </template>

    <template v-else-if="list.length === 0">
      <!-- @slot Slot for empty list -->
      <slot name="no-list-msg" />
    </template>

    <div
      v-else
      ref="listBase"
      class="virtual-list-base__items"
      :class="{ 'virtual-list-base__items--grid': gridTemplate }"
      :style="{ height: `${totalHeight}px` }"
    >
      <!-- @slot Slot for list main content -->
      <slot name="list" />
    </div>

    <div
      class="virtual-list-base__infinite-scroll-anchor"
      ref="infiniteScrollAnchor"
    />
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useResizeListener } from '@/vue/composables'

const EVENTS = {
  scroll: 'scroll',
  askLoadMore: 'ask-load-more',
  resize: 'resize',
}

export default {
  name: 'virtual-list-base',

  props: {
    /** List of entities to be displayed */
    list: { type: Array, required: true },
    /** Should loading stub be displayed */
    loading: { type: Boolean, default: false },
    /** Should the list emit ask more event */
    hasMoreItems: { type: Boolean, default: false },
    /** Should the list items be arranged as a grid */
    gridTemplate: { type: Boolean, default: false },
    /** Total height of the list in px */
    totalHeight: { type: Number, required: true },
    /** @type {HTMLElement} Element that will scroll  */
    scrolledElement: { type: Object, default: null },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      viewportHeight: 0,
      listWidth: 0,
      observer: null,
      topOffset: 0,
      scrollDirty: false,
      resizeListenerId: '',
    })
    const infiniteScrollAnchor = ref(null)
    const listBase = ref(null)
    const rootListBase = ref(null)
    const { addResizeListener, removeResizeListener } = useResizeListener()

    const isInfiniteScrollDisabled = computed(() =>
      props.loading || !props.hasMoreItems || props.list.length === 0,
    )

    async function loadingHandler (val) {
      if (!val) {
        state.listWidth = 0
        await onResize()
        await onScroll()
      }
    }

    function initObserver () {
      state.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          /**
           * Emits on reaching the list bottom if more items are available.
           * @type {undefined}
           */
          emit(EVENTS.askLoadMore)
        }
      })

      watch(
        isInfiniteScrollDisabled,
        (isDisabled) => {
          if (isDisabled) {
            state.observer.unobserve(infiniteScrollAnchor.value)
          } else {
            state.observer.observe(infiniteScrollAnchor.value)
          }
        },
        { immediate: true },
      )
    }

    async function onResize () {
      await nextTick()
      if (listBase.value) {
        const boundingRect = listBase.value.getBoundingClientRect()
        if (state.listWidth === boundingRect.width) return

        state.topOffset = rootListBase.value.offsetTop + boundingRect.y
        state.listWidth = boundingRect.width
        state.viewportHeight = window.innerHeight

        /**
         * Emits on resizing the window.
         * @type {HTMLDivElement}
         */
        emit(EVENTS.resize, listBase.value)
      }
    }

    async function onScroll () {
      if (!listBase.value) return

      state.topOffset = rootListBase.value.offsetTop

      if (!state.scrollDirty) {
        state.scrollDirty = true

        const scrollingElement = props.scrolledElement?.$el ||
          props.scrolledElement ||
          document.scrollingElement
        const scrollTop = scrollingElement.scrollTop - state.topOffset

        /**
         * Emits when document scroll event fired.
         * @type {number}
         */
        emit(EVENTS.scroll, scrollTop)

        await nextTick()
        state.scrollDirty = false
      }
    }

    watch(() => props.loading, loadingHandler, { immediate: true })
    watch(() => props.list, onResize)

    onMounted(async () => {
      await onResize()
      initObserver()

      const element = props.scrolledElement?.$el ||
        props.scrolledElement ||
        window

      element.addEventListener('scroll', onScroll, { passive: true })
      state.resizeListenerId = addResizeListener(onResize)
    })

    onBeforeUnmount(() => {
      const element = props.scrolledElement?.$el ||
        props.scrolledElement ||
        window

      element.removeEventListener('scroll', onScroll)
      removeResizeListener(state.resizeListenerId)
    })

    return {
      ...toRefs(state),
      infiniteScrollAnchor,
      listBase,
      rootListBase,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

$infinite-scroll-anchor: z-index(negative);

.virtual-list-base {
  position: relative;
}

.virtual-list-base__loading {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: var(--ui-list-row-gap, 1.2rem);
}

.virtual-list-base__items {
  position: relative;
  box-sizing: border-box;
  contain: layout;
  will-change: transform;
}

.virtual-list-base__loading,
.virtual-list-base__items {
  &--grid {
    display: grid;
    grid-template-rows: auto;
    grid-auto-columns: max-content;
    grid-auto-flow: row;
    grid-template-columns:
      var(
        --ui-list-grid-template-columns,
        repeat(auto-fill, minmax(16rem, 1fr))
      );
    row-gap: var(--ui-list-row-gap, 1.2rem);
    column-gap: var(--ui-list-column-gap, 1.2rem);
  }
}

.virtual-list-base__infinite-scroll-anchor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150vh; // Always keep at least one screen of content ahead
  max-height: 33%; // Handle lists embedded in dropdowns and etc
  z-index: $infinite-scroll-anchor;
  pointer-events: none;

  @include respond-to($x-medium) {
    bottom: 50vh;
    height: 100vh;
  }
}
</style>
