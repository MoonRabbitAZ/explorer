<template>
  <div
    v-if="!isCollectionFetched && isLoaded"
    class="collection-loader"
  >
    <app-button
      :scheme="buttonScheme"
      class="collection-loader__more-button"
      :text="$t('common.collection-loader.more-btn')"
      @click="loadNextPage"
    />
  </div>
</template>

<script>
/**
 * CollectionLoader is responsible for downloading pageable collections.
 * After loading emits the event ('first-page-load'
 * - when loaded first page and 'next-page-load' - when load next page)
 * with the loaded data and decide whether or not it should still show itself.
 *
 * @prop {Function} firstPageLoader - function for downloading first page of
 * data
 * @prop {Function} pageLimit - the maximum quantity of records per page
 *
 * Example:
 *
 * <collection-loader
 *    :first-page-loader="somePageableFuncWrapper"
 *    :page-limit="10"
 *    @first-page-load="onFirstPageLoad"
 *    @next-page-load="onNextPageLoad"
 * />
**/
import { ErrorHandler } from '@/js/helpers/error-handler'
import CONFIG from '@/config'

import { reactive, toRefs, watch } from 'vue'

const EVENTS = {
  firstPageLoad: 'first-page-load',
  nextPageLoad: 'next-page-load',
  error: 'error',
}

export default {
  name: 'collection-loader',
  props: {
    firstPageLoader: {
      type: Function,
      required: true,
    },
    pageLimit: {
      type: Number,
      default: CONFIG.DEFAULT_PAGE_LIMIT,
    },
    buttonScheme: {
      type: String,
      default: 'secondary',
    },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    const state = reactive({
      nextPageLoader: () => {},
      isCollectionFetched: false,
      isLoaded: false,
    })

    async function loadPage (eventName, loaderFn) {
      state.isLoaded = false
      try {
        const response = await loaderFn()
        emit(eventName, response.data)
        state.nextPageLoader = response.fetchNext
        state.isCollectionFetched = response.data.length < props.pageLimit
      } catch (e) {
        state.isCollectionFetched = true
        emit(EVENTS.error, e)
        ErrorHandler.processWithoutFeedback(e)
      }
      state.isLoaded = true
    }

    function loadFirstPage () {
      loadPage(EVENTS.firstPageLoad, props.firstPageLoader)
    }

    function loadNextPage () {
      loadPage(EVENTS.nextPageLoad, state.nextPageLoader)
    }

    watch(() => props.firstPageLoader, loadFirstPage, { immediate: true })

    return {
      ...toRefs(state),
      loadNextPage,
      loadFirstPage,
    }
  },
}
</script>

<style lang="scss" scoped>
  .collection-loader {
    display: flex;
    justify-content: center;
  }
</style>
