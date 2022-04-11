<template>
  <div class="evm-explorer-overview-tab">
    <div class="evm-explorer-overview-tab__search-wrap">
      <!-- eslint-disable max-len -->
      <input-field
        v-model="form.search.value"
        class="evm-explorer-overview-tab__search-field"
        name="evm-explorer-overview-tab-search"
        :placeholder="$t('evm-explorer-page.evm-explorer-overview-tab.search-field-placeholder')"
        :error-message="form.search.errorMessage"
        @blur="form.search.blur"
        @keydown.enter="searchBlock"
      />
      <!-- eslint-enable max-len -->

      <app-button
        scheme="primary"
        mdi-icon-name="mdi-magnify"
        @click="searchBlock"
      />
    </div>

    <template v-if="loading">
      <loader/>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { InputField } from '@/vue/fields'
import Loader from '@/vue/common/Loader'

import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { vueRoutes } from '@/vue-router'
import { useForm, useValidators } from '@/vue/composables'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'
import { useQuery } from '@vue/apollo-composable'

import GET_SEARCH_RESULT from '@/graphql/queries/getSearchResult.gql'

export default {
  name: 'evm-explorer-overview-tab',

  components: { InputField, Loader },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const variables = ref({
      parameter: route?.query
        ? route?.query?.blockNumber || route?.query?.hash
        : '',
    })
    const isEnabled = computed(() => Boolean(variables.value.parameter))
    const options = reactive({
      fetchPolicy: 'no-cache',
      enabled: isEnabled,
    })

    const { maxLength, evmSearch } = useValidators()

    const formController = useForm({
      search: {
        value: '',
        validators: {
          maxLength: maxLength(MAX_FIELD_LENGTH.search),
          evmSearch,
        },
      },
    })

    const { onResult, loading } =
      useQuery(GET_SEARCH_RESULT, variables, options)

    function searchBlock () {
      const searchValue = formController.form.search.value
      if (formController.isFormValid() && searchValue) {
        variables.value = { parameter: searchValue }
        formController.clearFields()
      }
    }

    onResult(({ data }) => {
      if (data?.searchResult?.addressHash) {
        router.push({
          ...vueRoutes.evmExplorerAddress,
          query: { hash: data.searchResult.addressHash },
        })
      } else if (data?.searchResult?.txHash) {
        router.push({
          ...vueRoutes.evmExplorerTransaction,
          query: { hash: data.searchResult.txHash },
        })
      } else if (data?.searchResult?.blockHash) {
        router.push({
          ...vueRoutes.evmExplorerBlock,
          query: { hash: data.searchResult.blockHash },
        })
      } else {
        router.push(vueRoutes.evmExplorerSearchError)
      }
    })

    return {
      ...formController,
      loading,
      searchBlock,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

.evm-explorer-overview-tab { @include app-padding; }

.evm-explorer-overview-tab__search-wrap {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  margin-bottom: 3rem;
}

.evm-explorer-overview-tab__search-field {
  max-width: 37.5rem;
  margin-right: 2rem;
}
</style>
