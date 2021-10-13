<template>
  <div class="tips-tab">
    <div class="tips-tab__topbar">
      <app-button
        scheme="primary"
        :text="$t('treasury-page.tips-tab.propose-tip-btn')"
        disabled
      />
      <app-button
        scheme="primary"
        :text="$t('treasury-page.tips-tab.median-tip-selected-btn')"
        disabled
      />
    </div>

    <tips-list class="tips-tab__list"/>
  </div>
</template>

<script>
import TipsList from '@treasury-page/tabs/tips/TipsList'

export default {
  name: 'tips-tab',

  components: { TipsList },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tips-tab { @include app-padding; }

.tips-tab__topbar {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  margin: 3rem 0;

  @include respond-to($x-small) {
    flex-direction: column;
    width: 100%;
  }
}

.tips-tab__list {
  & + & {
    margin-top: 3rem;
  }
}
</style>
