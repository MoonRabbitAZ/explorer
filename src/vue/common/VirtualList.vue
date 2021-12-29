<template>
  <virtual-list-base
    ref="uiList"
    class="virtual-list"
    :list="list"
    :loading="loading"
    :has-more-items="hasMoreItems"
    :grid-template="gridTemplate"
    :total-height="totalListHeight"
    :scrolled-element="scrolledElement"
    @resize="onResize"
    @scroll="onScroll"
    @ask-load-more="askLoadMore"
  >
    <template v-slot:loading-stub>
      <!-- @slot Slot for loading state -->
      <slot name="loading-stub" />
    </template>

    <template v-slot:no-list-msg>
      <!-- @slot Slot for empty list -->
      <slot name="no-list-msg" />
    </template>

    <template v-slot:list>
      <div
        v-for="(item, i) in viewportList"
        :key="`viewport-item-${topIndex + i}`"
        class="virtual-list__item"
        :class="{ 'virtual-list__item--absolute': visibleItemsCount > 1 }"
        :style="itemStyles[topIndex + i]"
        :data-key="topIndex + i"
      >
        <!--
            @slot Slot for the list item
                @binding {object} item List item entity
          -->
        <slot
          name="list"
          :item="item"
        />
      </div>

      <div
        v-for="i in skeletonsCount"
        :key="i"
        class="virtual-list__item virtual-list__item_loading"
        :class="{ 'virtual-list__item_absolute': visibleItemsCount > 1 }"
        :style="itemStyles[list.length + i - 1]"
      >
        <!-- @slot Slot for loading next page -->
        <slot name="next-loading-stub" />
      </div>
    </template>
  </virtual-list-base>
</template>

<script>
import VirtualListBase from '@/vue/common/VirtualListBase'

import { ref, toRefs, reactive, computed, watch, nextTick } from 'vue'

const EVENTS = {
  scroll: 'scroll',
  askLoadMore: 'ask-load-more',
}

export default {
  name: 'virtual-list',
  components: { VirtualListBase },

  props: {
    /**  List of entities to be displayed */
    list: { type: Array, required: true },
    /** Should loading stub be displayed */
    loading: { type: Boolean, default: false },
    /** Should the list emit ask more event */
    hasMoreItems: { type: Boolean, default: false },
    /** Should the list items be arranged as a grid */
    gridTemplate: { type: Boolean, default: false },
    /** Can list items have different height with each other */
    variableHeight: { type: Boolean, default: false },
    /** @type {HTMLElement} Element that will scroll  */
    scrolledElement: { type: Object, default: null },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      gridGap: 0,
      gridItemWidth: 0,
      itemHeight: 0,
      itemHeights: [],
      topIndex: 0,
    })
    const uiList = ref(null)

    const visibleRowsCount = computed(() => {
      const viewportHeight = uiList.value?.viewportHeight || 0
      return state.itemHeight && viewportHeight
        ? Math.ceil(viewportHeight / state.itemHeight)
        : 0
    })

    const viewportList = computed(() => {
      const endIndex = Math.min(
        state.topIndex + visibleItemsCount.value,
        props.list.length,
      )

      return props.list.slice(state.topIndex, endIndex)
    })

    const itemsPerRow = computed(() => {
      const listWidth = uiList.value?.listWidth || 0
      const fullItemWidth = state.gridItemWidth + state.gridGap

      if (!props.gridTemplate || fullItemWidth <= 0) return 1

      return Math.floor((listWidth + state.gridGap) / fullItemWidth) || 1
    })

    const outletItemsCount = computed(() =>
      visibleRowsCount.value * itemsPerRow.value,
    )

    const visibleItemsCount = computed(() => {
      const maxItemsCount = visibleRowsCount.value * itemsPerRow.value +
        2 * outletItemsCount.value

      return state.itemHeight === 0
        ? 1
        : Math.min(maxItemsCount, props.list.length)
    })

    const itemRowsCount = computed(() =>
      Math.ceil(props.list.length / itemsPerRow.value),
    )

    const skeletonsCount = computed(() => {
      if (!props.hasMoreItems || !itemRowsCount.value) return 0

      const fillCount =
        itemRowsCount.value * itemsPerRow.value - props.list.length
      return fillCount || itemsPerRow.value
    })

    const totalRowsCount = computed(() =>
      skeletonsCount.value === itemsPerRow.value
        ? itemRowsCount.value + 1
        : itemRowsCount.value,
    )

    const totalListHeight = computed(() => {
      if (props.variableHeight) {
        return state.itemHeights
          .slice(0, totalRowsCount.value)
          .reduce((acc, val) => acc + (val || state.itemHeight), 0)
      }

      return state.itemHeight * totalRowsCount.value
    })

    const itemStyles = computed(() => {
      return new Array(props.list.length + skeletonsCount.value)
        .fill()
        .map((_, i) => {
          const cellNumber = i % itemsPerRow.value
          const transform = { x: 0, y: 0 }

          if (props.gridTemplate && itemsPerRow.value > 1) {
            transform.x = cellNumber * (state.gridItemWidth + state.gridGap)
            transform.y =
              (i - cellNumber) / itemsPerRow.value * state.itemHeight
          } else {
            transform.y = state.itemHeights
              .slice(0, i)
              .reduce((acc, val) => acc + (val || state.itemHeight), 0)
          }

          return {
            width: state.gridItemWidth ? `${state.gridItemWidth}px` : '100%',
            transform: `translate(${transform.x}px, ${transform.y}px)`,
          }
        })
    })

    // Fill heights array with offset height of visible elements,
    // similar to https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/infinite-scroller
    function calculateHeights () {
      if (!props.variableHeight) return

      Array.from(uiList.value.$el.querySelectorAll('.virtual-list__item'))
        .slice(0, viewportList.value.length)
        .forEach((el, i) => {
          const currentIndex = Number(el?.attributes?.['data-key']?.value || -1)
          if (currentIndex === -1) return

          if (state.itemHeights[currentIndex] === 0) {
            state.itemHeights[currentIndex] = el.offsetHeight
          }
        })
    }

    function onScroll (scrollTop) {
      const topRowIndex = Math.floor(
        scrollTop / totalListHeight.value * totalRowsCount.value,
      )
      state.topIndex = Math.max(
        topRowIndex * itemsPerRow.value - outletItemsCount.value,
        0,
      )

      if (props.variableHeight) {
        calculateHeights()
      }

      emit(EVENTS.scroll, scrollTop)
    }

    async function onResize (list) {
      if (!list.children[0]) return

      if (state.itemHeight) {
        state.gridItemWidth = 0
        state.itemHeight = 0
        await nextTick()
      }

      state.itemHeight = list.children[0].offsetHeight

      if (props.gridTemplate) {
        const listStyle = window.getComputedStyle(list)
        state.gridGap = parseInt(listStyle.gridColumnGap)
        state.gridItemWidth = parseInt(listStyle.gridTemplateColumns)
      }

      if (props.variableHeight) {
        await adjustVariableHeight()
      }
    }

    function askLoadMore () {
      /**
       * Emits on reaching the list bottom if more items are available.
       * @type {undefined}
       */
      emit(EVENTS.askLoadMore)
    }

    async function adjustVariableHeight () {
      state.itemHeights = new Array(state.totalRowsCount).fill(0)
      await nextTick()
      calculateHeights()
    }

    async function listHandler (val, oldVal = []) {
      const lengthDelta = val.length - oldVal.length

      if (lengthDelta > 0) {
        const emptyArray = new Array(lengthDelta).fill(0)
        state.itemHeights = state.itemHeights.concat(emptyArray)
      } else if (lengthDelta < 0) {
        await adjustVariableHeight()
      }
    }

    watch(() => props.list, listHandler, { immediate: true })

    return {
      ...toRefs(state),
      uiList,
      viewportList,
      itemStyles,
      totalListHeight,
      visibleItemsCount,
      skeletonsCount,

      onScroll,
      onResize,
      askLoadMore,
    }
  },
}
</script>

<style lang="scss" scoped>
.virtual-list__item {
  display: inherit;
  padding-bottom: var(--virtual-list-row-gap, 0.4rem);
  height: max-content;

  &--absolute {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
  }
}
</style>
