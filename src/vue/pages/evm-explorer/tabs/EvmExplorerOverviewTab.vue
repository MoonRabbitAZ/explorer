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

    <router-view />
  </div>
</template>

<script>
import { InputField } from '@/vue/fields'

import { useRouter } from 'vue-router'
import { useForm, useValidators } from '@/vue/composables'
import { vueRoutes } from '@/vue-router'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'
import { isHex } from '@polkadot/util'

export default {
  name: 'evm-explorer-overview-tab',

  components: { InputField },

  setup () {
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

    async function searchBlock () {
      const searchValue = formController.form.search.value
      if (formController.isFormValid() && searchValue) {
        if (isHex(searchValue, 160)) {
          router.push({
            ...vueRoutes.evmExplorerAddress,
            params: {
              hash: formController.form.search.value,
            },
          })
        } else if (isHex(searchValue, 256)) {
          router.push({
            ...vueRoutes.evmExplorerTransaction,
            params: {
              hash: formController.form.search.value,
            },
          })
        } else {
          router.push({
            ...vueRoutes.evmExplorerBlock,
            params: {
              blockNumber: formController.form.search.value,
            },
          })
        }
        formController.form.search.value = ''
        formController.form.search.errorMessage = ''
      }
    }

    return {
      ...formController,
      searchBlock,
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
