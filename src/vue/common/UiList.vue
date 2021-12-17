<template>
  <ui-list-base
    ref="list"
    class="ui-list"
    :list="list"
    :loading="loading"
    :has-more-items="hasMoreItems"
    :grid-template="gridTemplate"
    :total-height="totalListHeight"
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
        :key="`${item[keyField]}-${topIndex + i}`"
        class="ui-list__item"
        :class="{ 'ui-list__item_absolute': visibleItemsCount > 1 }"
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
        class="ui-list__item ui-list__item_loading"
        :class="{ 'ui-list__item_absolute': visibleItemsCount > 1 }"
        :style="itemStyles[list.length + i - 1]"
      >
        <!-- @slot Slot for loading next page -->
        <slot name="next-loading-stub" />
      </div>
    </template>
  </ui-list-base>
</template>

<script>
import UiListBase from '@/vue/common/UiListBase'
import get from 'lodash/get'
import isEqualWith from 'lodash/isEqualWith'

export default {
  name: 'ui-list',
  components: { UiListBase },

  props: {
    /**  List of entities to be displayed */
    list: { type: Array, required: true },
    /** Should loading stub be displayed */
    loading: { type: Boolean, default: false },
    /** Should the list emit ask more event */
    hasMoreItems: { type: Boolean, default: false },
    /** Should the list items be arranged as a grid */
    gridTemplate: { type: Boolean, default: false },
    /** Key field of the list item entity */
    keyField: { type: String, default: 'id' },
    /** Can list items have different height with each other */
    variableHeight: { type: Boolean, default: false },
  },

  data () {
    return {
      gridGap: 0,
      gridItemWidth: 0,
      itemHeight: 0,
      itemHeights: [],
      topIndex: 0,
    }
  },

  computed: {
    totalListHeight () {
      if (this.variableHeight) {
        return this.itemHeights
          .slice(0, this.totalRowsCount)
          .reduce((acc, val) => acc + (val || this.itemHeight), 0)
      }

      return this.itemHeight * this.totalRowsCount
    },

    totalRowsCount () {
      return this.skeletonsCount === this.itemsPerRow
        ? this.itemRowsCount + 1
        : this.itemRowsCount
    },

    skeletonsCount () {
      if (!this.hasMoreItems || !this.itemRowsCount) {
        return 0
      }

      const fillCount = this.itemRowsCount * this.itemsPerRow - this.list.length
      return fillCount || this.itemsPerRow
    },

    itemRowsCount () {
      return Math.ceil(this.list.length / this.itemsPerRow)
    },

    itemsPerRow () {
      const listWidth = get(this.$refs, 'list.listWidth', 0)
      const fullItemWidth = this.gridItemWidth + this.gridGap

      if (!this.gridTemplate || fullItemWidth <= 0) {
        return 1
      }

      return Math.floor((listWidth + this.gridGap) / fullItemWidth) || 1
    },

    outletItemsCount () {
      return this.visibleRowsCount * this.itemsPerRow
    },

    viewportList () {
      const endIndex = Math.min(
        this.topIndex + this.visibleItemsCount,
        this.list.length,
      )

      return this.list.slice(this.topIndex, endIndex)
    },

    visibleRowsCount () {
      const viewportHeight = get(this.$refs, 'list.viewportHeight', 0)
      return Math.ceil(viewportHeight / this.itemHeight)
    },

    visibleItemsCount () {
      const maxItemsCount = this.visibleRowsCount * this.itemsPerRow +
        2 * this.outletItemsCount

      return this.itemHeight === 0
        ? 1
        : Math.min(maxItemsCount, this.list.length)
    },

    itemStyles () {
      return new Array(this.list.length + this.skeletonsCount)
        .fill()
        .map((_, i) => {
          const cellNumber = i % this.itemsPerRow
          const transform = { x: 0, y: 0 }

          if (this.gridTemplate && this.itemsPerRow > 1) {
            transform.x = cellNumber * (this.gridItemWidth + this.gridGap)
            transform.y = (i - cellNumber) / this.itemsPerRow * this.itemHeight
          } else {
            transform.y = this.itemHeights
              .slice(0, i)
              .reduce((acc, val) => acc + (val || this.itemHeight), 0)
          }

          return {
            width: this.gridItemWidth ? `${this.gridItemWidth}px` : '100%',
            transform: `translate(${transform.x}px, ${transform.y}px)`,
          }
        })
    },
  },

  watch: {
    list: {
      immediate: true,
      deep: true,
      async handler (val, oldVal = []) {
        const lengthDelta = val.length - oldVal.length
        const arrayLength = lengthDelta > 0 ? lengthDelta : val.length
        const emptyArray = new Array(arrayLength).fill(0)

        const keyComparator = (a, b) => a[this.keyField] === b[this.keyField]
        const isIdsEqual = isEqualWith(val, oldVal, keyComparator)

        if (lengthDelta > 0) {
          this.itemHeights = this.itemHeights.concat(emptyArray)
        } else if (!isIdsEqual || lengthDelta < 0) {
          await this.adjustVariableHeight()
        }
      },
    },
  },

  methods: {
    askLoadMore () {
      /**
       * Emits on reaching the list bottom if more items are available.
       * @type {undefined}
       */
      this.$emit('ask-load-more')
    },

    async onResize (list) {
      if (!list.children[0]) return

      if (this.itemHeight) {
        this.gridItemWidth = 0
        this.itemHeight = 0
        await this.$nextTick()
      }

      this.itemHeight = list.children[0].offsetHeight

      if (this.gridTemplate) {
        const listStyle = window.getComputedStyle(list)
        this.gridGap = parseInt(listStyle.gridColumnGap)
        this.gridItemWidth = parseInt(listStyle.gridTemplateColumns)
      }

      if (this.variableHeight) {
        await this.adjustVariableHeight()
      }
    },

    onScroll (scrollTop) {
      const topRowIndex = Math.floor(
        scrollTop / this.totalListHeight * this.totalRowsCount,
      )
      this.topIndex = Math.max(
        topRowIndex * this.itemsPerRow - this.outletItemsCount,
        0,
      )

      if (this.variableHeight) {
        this.calculateHeights()
      }

      this.$emit('scroll', scrollTop)
    },

    // Fill heights array with offset height of visible elements,
    // similar to https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/infinite-scroller
    calculateHeights () {
      if (!this.variableHeight) return

      Array.from(this.$refs.list.$el.querySelectorAll('.ui-list__item'))
        .slice(0, this.viewportList.length)
        .forEach((el, i) => {
          const currentIndex = Number(get(el, 'attributes.data-key.value', -1))
          if (currentIndex === -1) return

          if (this.itemHeights[currentIndex] === 0) {
            this.$set(this.itemHeights, currentIndex, el.offsetHeight)
          }
        })
    },

    async adjustVariableHeight () {
      this.itemHeights = new Array(this.totalRowsCount).fill(0)
      await this.$nextTick()
      this.calculateHeights()
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-list {
  &__item {
    display: inherit;
    padding-bottom: var(--ui-list-row-gap, 0.4rem);
    height: max-content;

    &_absolute {
      position: absolute;
      top: 0;
      left: 0;
      height: auto;
    }
  }
}
</style>
