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

    <template v-if="isSearchProcessing">
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

import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { vueRoutes } from '@/vue-router'
import { useForm, useValidators } from '@/vue/composables'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'
import { useQuery } from '@vue/apollo-composable'
// import { isHex } from '@polkadot/util'

import GET_SEARCH_RESULT from '@/graphql/queries/getSearchResult.gql'

export default {
  name: 'evm-explorer-overview-tab',

  components: { InputField, Loader },

  setup () {
    const isSearchProcessing = ref(false)
    const variables = reactive({ parameter: '' })
    const options = reactive({
      fetchPolicy: 'no-cache',
      enabled: false,
    })
    const router = useRouter()

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

    const { onResult } = useQuery(GET_SEARCH_RESULT, variables, options)

    onResult(({ data }) => {
      isSearchProcessing.value = false
      if (data?.searchResult.addressHash) {
        router.push({
          ...vueRoutes.evmExplorerAddress,
          query: { hash: data.searchResult.addressHash },
        })
      } else if (data?.searchResult.txHash) {
        router.push({
          ...vueRoutes.evmExplorerTransaction,
          query: { hash: data.searchResult.txHash },
        })
      } else if (data?.searchResult.blockHash) {
        router.push({
          ...vueRoutes.evmExplorerBlock,
          query: { hash: data.searchResult.blockHash },
        })
      }

      options.enabled = false
    })

    async function searchBlock () {
      const searchValue = formController.form.search.value
      if (formController.isFormValid() && searchValue) {
        isSearchProcessing.value = true
        options.enabled = true
        variables.parameter = searchValue
        formController.clearFields()
        return
      }
      isSearchProcessing.value = false
    }

    onMounted(() => { })

    return {
      ...formController,
      searchBlock,
      isSearchProcessing,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

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
