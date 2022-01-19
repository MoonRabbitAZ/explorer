<template>
  <div class="pagination">
    <app-button
      class="pagination__first-page-btn"
      scheme="secondary"
      size="x-small"
      mdi-icon-name="mdi-chevron-double-left"
      @click="toFirstPage"
    />
    <app-button
      class="pagination__prev-page-btn"
      scheme="secondary"
      size="x-small"
      mdi-icon-name="mdi-chevron-left"
      @click="toPreviousPage"
    />
    <p class="pagination__page-number">
      <!--  -->
    </p>
    <app-button
      class="pagination__next-page-btn"
      scheme="secondary"
      size="x-small"
      mdi-icon-name="mdi-chevron-right"
      @click="toNextPage"
    />
  </div>
</template>

<script>
const EVENTS = {
  toFirstPage: 'to-first-page',
  toNextPage: 'to-next-page',
  toPreviousPage: 'to-previous-page',
}

export default {
  name: 'pagination',

  props: {
    isFirsPageBtnDisabled: { type: Boolean, default: false },
    isNextBtnDisabled: { type: Boolean, default: false },
    isPrevBtnDisabled: { type: Boolean, default: false },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    function toFirstPage () { emit(EVENTS.toFirstPage) }
    function toNextPage () { emit(EVENTS.toNextPage) }
    function toPreviousPage () { emit(EVENTS.toPreviousPage) }

    return {
      toFirstPage,
      toNextPage,
      toPreviousPage,
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.pagination {
  display: flex;
  width: max-content;
}

.pagination__first-page-btn {
  margin-right: 1rem;
}

.pagination__page-number {
  margin: 0 2rem;
  font-size: 1.6rem;
}
</style>
