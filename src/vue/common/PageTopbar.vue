<template>
  <div class="page-topbar">
    <h4 class="page-topbar__page-name">
      {{ pageName }}
    </h4>

    <div
      v-if="tabs.length"
      class="page-topbar__tabs"
    >
      <router-link
        v-for="(tab, id) in tabs"
        class="page-topbar__tab-link"
        :to="tab.route"
        :key="id"
      >
        {{ tab.translationName }}
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'event-calendar',

  props: {
    pageName: { type: String, required: true },
    tabs: { type: Array, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

.page-topbar {
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  height: 4rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  @include respond-to($sidebar-hide-bp) {
    padding: 0 $app-padding-mobile;
  }
}

.page-topbar__page-name {
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 0 4rem;
  height: 4rem;
  margin-right: 2rem;
  min-width: 22rem;
  background: $col-app-block-bg;
  border-radius: 0 0.4rem 0.4rem 0;

  @include respond-to($sidebar-hide-bp) {
    display: none;
  }
}

.page-topbar__tabs {
  display: flex;
  align-items: center;
}

.page-topbar__tab-link {
  font-size: 1.4rem;
  white-space: nowrap;
  color: $col-page-topbar-link;

  & + & {
    margin-left: 3.2rem;
  }

  &:hover {
    color: $col-app-accent;
  }

  &.router-link-active {
    position: relative;
    color: $col-app-accent;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.6rem;
      width: 50%;
      height: 0.2rem;
      border-radius: 0.4rem;
      background-color: $col-app-accent;
    }
  }
}

</style>
