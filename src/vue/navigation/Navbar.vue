<template>
  <nav class="navbar">
    <div class="navbar__groups-wrap">
      <logo class="navbar__logo"/>

      <group-menu-links
        class="navbar__links-group"
        v-for="(group, id) in linksGroups"
        :key="group.name + id"
        :group-routers="group"
        :links-groups="linksGroups"
      />
    </div>

    <div class="navbar__settings-wrap">
      <chain-info class="navbar__chain-info"/>
    </div>

    <burger-button
      v-model:is-open="isSidebarOpen"
      class="navbar__burger-button"
    />

    <drawer
      class="navbar__drawer"
      v-model:is-shown="isSidebarOpen"
    >
      <template #heading>
        <logo class="navbar__logo"/>
      </template>
      <div class="navbar__drawer-content">
        <group-menu-links-mobile
          class="navbar__links-group-mobile"
          v-for="(group, id) in linksGroups"
          @click-route="isSidebarOpen = false"
          :key="group.name + id"
          :group-routers="group"
        />

        <chain-info
          class="navbar__chain-info-mobile"
          is-mobile
        />
      </div>
    </drawer>
  </nav>
</template>

<script>
import GroupMenuLinks from '@/vue/navigation/navbar/GroupMenuLinks'
import GroupMenuLinksMobile from '@/vue/navigation/navbar/GroupMenuLinksMobile'
import ChainInfo from '@/vue/navigation/navbar/ChainInfo'
import BurgerButton from '@/vue/common/BurgerButton'
import Logo from '@/vue/common/Logo'
import Drawer from '@/vue/common/Drawer'
import { useMenuLinksGroups } from '@/vue/composables'

import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { computed, ref } from 'vue'

export default {
  name: 'navbar',

  components: {
    GroupMenuLinks,
    GroupMenuLinksMobile,
    BurgerButton,
    Drawer,
    ChainInfo,
    Logo,
  },

  setup () {
    const linksGroups = useMenuLinksGroups()
    const store = useStore()
    const isSidebarOpen = ref(false)

    const systemChain = computed(() => store.getters[vuexTypes.systemChain])
    const specName = computed(() => store.getters[vuexTypes.specName])
    const specVersion = computed(() => store.getters[vuexTypes.specVersion])
    const lastBlockNumber =
      computed(() => store.getters[vuexTypes.lastBlockNumber])

    return {
      isSidebarOpen,
      specName,
      systemChain,
      specVersion,
      lastBlockNumber,
      linksGroups,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.navbar {
  height: $app-navbar-height;
  min-height: $app-navbar-height;
  background: $col-app-block-bg;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include app-padding;
}

.navbar__groups-wrap {
  display: flex;
  align-items: center;
}

.navbar__logo {
  margin-right: 3.2rem;
}

.navbar__links-group {
  & + & {
    margin-left: 3.2rem;
  }

  @include respond-to($sidebar-hide-bp) {
    display: none;
  }
}

.navbar__settings-wrap {
  display: flex;
  align-items: center;

  @include respond-to($sidebar-hide-bp) {
    display: none;
  }
}

.navbar__settings-link {
  margin: 0 4.5rem 0 2.7rem;
  font-size: 2rem;
  color: $col-navigation-link;

  &:hover {
    color: $col-app-accent;
  }
}

.navbar__burger-button {
  display: none;
  margin-left: auto;

  @include respond-to($sidebar-hide-bp) {
    display: block;
  }
}

.navbar__links-group-mobile {
  & + & {
    margin-top: 2.6rem;
  }

  &:last-child {
    margin-bottom: 3.2rem;
  }
}

.navbar__drawer {
  display: none;

  @include respond-to($sidebar-hide-bp) {
    display: block;
  }
}

.navbar__drawer-content {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.navbar__chain-info-mobile {
  margin-top: auto;
}
</style>
