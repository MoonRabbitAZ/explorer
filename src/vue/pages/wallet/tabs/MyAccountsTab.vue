<template>
  <div class="my-accounts-tab">
    <div class="my-accounts-tab__top-bar">
      <div class="my-accounts-tab__search-wrap">
        <input-field
          v-model="form.search.value"
          class="my-accounts-tab__search-field"
          name="my-accounts-tab-search"
          :error-message="form.search.errorMessage"
          :placeholder="
            $t('wallet-page.my-accounts-tab.search-field-placeholder')
          "
          @blur="form.search.blur"
        />
      </div>
      <div class="my-accounts-tab__actions">
        <app-button
          class="my-accounts-tab__actions-button"
          scheme="primary"
          :text="$t('wallet-page.my-accounts-tab.generate-btn')"
          @click="isGenerateAccountOpen = true"
        />
        <app-button
          class="my-accounts-tab__actions-button"
          scheme="primary"
          :text="$t('wallet-page.my-accounts-tab.import-btn')"
          @click="isImportAccountOpen = true"
        />
      </div>
    </div>
    <template v-if="isLoaded">
      <accounts-list
        :accounts="sortedAccounts"
        :amount-accounts="allAccounts.length"
      />
    </template>
    <template v-else>
      <loader class="app__main-loader"/>
    </template>

    <drawer
      v-model:is-shown="isGenerateAccountOpen"
      is-default-body
      :close-by-click-outside="false"
    >
      <template #heading>
        {{ $t('wallet-page.my-accounts-tab.generate-account-drawer-title') }}
      </template>
      <create-account-form
        @close-drawer="isGenerateAccountOpen = false"
      />
    </drawer>

    <drawer
      v-model:is-shown="isImportAccountOpen"
      is-default-body
      :close-by-click-outside="false"
    >
      <template #heading>
        {{ $t('wallet-page.my-accounts-tab.import-account-drawer-title') }}
      </template>
      <create-account-form
        is-import-account
        @close-drawer="isImportAccountOpen = false"
      />
    </drawer>
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'
import AccountsList from '@wallet-page/tabs/my-accounts/AccountsList'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import CreateAccountForm from '@/vue/forms/CreateAccountForm'

import { reactive, toRefs, computed, onBeforeUnmount } from 'vue'
import { keyring } from '@polkadot/ui-keyring'
import { useForm, useValidators } from '@/vue/composables'

import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

export default {
  name: 'my-accounts-tab',

  components: {
    InputField,
    AccountsList,
    Loader,
    Drawer,
    CreateAccountForm,
  },

  setup () {
    const state = reactive({
      allAccounts: [],
      isLoaded: false,
      isGenerateAccountOpen: false,
      isImportAccountOpen: false,
      subscriber: null,
    })

    const { maxLength } = useValidators()

    const formController = useForm({
      search: {
        value: '',
        validators: {
          maxLength: maxLength(MAX_FIELD_LENGTH.search),
        },
      },
    })

    state.subscriber = keyring.accounts.subject.subscribe(accounts => {
      const addresses = accounts ? Object.keys(accounts) : []
      state.allAccounts = addresses.map(address => keyring.getAccount(address))
      state.isLoaded = true
    })

    const sortedAccounts = computed(() =>
      state.allAccounts.filter(({ address, meta: { name } }) =>
        address.includes(formController.form.search.value) ||
          name.includes(formController.form.search.value)),
    )

    onBeforeUnmount(() => {
      if (state.subscriber) state.subscriber.unsubscribe()
    })

    return {
      ...formController,
      ...toRefs(state),
      sortedAccounts,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.my-accounts-tab { @include app-padding; }

.my-accounts-tab__top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;

  @include respond-to($sidebar-hide-bp) {
    flex-direction: column;
  }
}

.my-accounts-tab__search-wrap {
  display: flex;
  flex-wrap: nowrap;
  width: 37.5rem;

  @include respond-to($sidebar-hide-bp) {
    margin-bottom: 3rem;
  }
  @include respond-to($x-small) {
    width: 100%;
  }
}

.my-accounts-tab__actions {
  display: flex;
}

.my-accounts-tab__actions-button {
  & + & {
    margin-left: 2rem;
  }

  @include respond-to($x-small) {
    width: 100%;
  }
}
</style>
