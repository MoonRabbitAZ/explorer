<template>
  <div
    class="group-menu-links"
    :class="{'group-menu-links--active': isActiveRouter}"
  >
    <template v-if="groupRouters.name === linksGroups.settings.name">
      <router-link
        class="group-menu-links__link group-menu-links__link-settings"
        :to="groupRouters.links[0].route"
      >
        <i class="mdi mdi-cog-outline"/>
      </router-link>
    </template>

    <template v-else-if="groupRouters.links.length === 1">
      <router-link
        v-if="groupRouters.links[0].route"
        class="group-menu-links__link"
        :to="groupRouters.links[0].route"
      >
        {{ groupRouters.links[0].translationName }}
      </router-link>
      <a
        v-else
        :href="groupRouters.links[0].link"
        target="_blank"
        rel="noopener"
        class="group-menu-links__link"
      >
        {{ groupRouters.links[0].translationName }}
      </a>
    </template>

    <template v-else>
      <div class="group-menu-links__title">
        <span class="group-menu-links__name">
          {{ groupRouters.groupTranslationName }}
        </span>
        <i class="mdi mdi-chevron-down group-menu-links__icon" />
      </div>
      <div class="group-menu-links__dropdown">
        <template
          v-for="(link, id) in groupRouters.links"
          :key="id"
        >
          <router-link
            v-if="link.route"
            class="group-menu-links__dropdown-link"
            :to="link.route"
          >
            {{ link.translationName }}
          </router-link>
          <a
            v-else
            :href="link.link"
            target="_blank"
            rel="noopener"
            class="group-menu-links__dropdown-link"
          >
            {{ link.translationName }}
          </a>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'group-menu-links',

  props: {
    groupRouters: { type: Object, required: true },
    linksGroups: { type: Object, required: true },
  },

  setup (props) {
    const routers = useRoute()

    const isActiveRouter = computed(
      () => routers.matched.some(({ name }) =>
        !!props.groupRouters.links.find(link => link.route?.name === name)),
    )

    return {
      isActiveRouter,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.group-menu-links {
  cursor: pointer;
  position: relative;

  &:hover {
    .group-menu-links__icon {
      transform: rotate(180deg);
    }

    .group-menu-links__dropdown {
      display: block;
    }
  }

  &--active {
    .group-menu-links__name,
    .group-menu-links__icon,
    .group-menu-links__link {
      color: $col-app-accent;
    }
  }
}

.group-menu-links__title {
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
}

.group-menu-links__link {
  font-size: 1.6rem;
  line-height: 2rem;
  padding: 0 1.2rem;
  color: $col-navigation-link;

  &:hover {
    color: $col-app-accent;
  }
}

.group-menu-links__link-settings {
  font-size: 2rem;
  line-height: 1;
}

.group-menu-links__name {
  font-size: 1.6rem;
  line-height: 2rem;
}

.group-menu-links__icon {
  font-size: 2.5rem;
  line-height: 1;
  margin-left: 1rem;
  transition: all 0.1s linear;
}

.group-menu-links__dropdown {
  display: none;
  min-width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: $z-group-menu-links-dropdown;
  border-radius: 0.4rem;
  box-shadow: $col-group-menu-links-dropdown-shadow;
  background: $col-app-block-bg;
  overflow: hidden;
}

.group-menu-links__dropdown-link {
  display: block;
  padding: 0.8rem 1.2rem;
  font-size: 1.6rem;
  white-space: nowrap;
  color: $col-navigation-link;

  &:hover {
    background: $col-app-accent;
    color: $col-app-text-dark;
  }
}

</style>
