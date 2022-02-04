<template>
  <div
    class="group-menu-links-mobile"
    :class="{
      'group-menu-links-mobile--active': isActiveRouter,
      'group-menu-links-mobile--open': isOpenDropdown
    }"
  >
    <template v-if="groupRouters.links.length === 1">
      <router-link
        v-if="groupRouters.links[0].route"
        class="group-menu-links-mobile__link"
        @click="$emit(EVENTS.clickRoute, $event)"
        :to="groupRouters.links[0].route"
      >
        {{ groupRouters.links[0].translationName }}
      </router-link>
      <a
        v-else
        :href="groupRouters.links[0].link"
        target="_blank"
        rel="noopener"
        class="group-menu-links-mobile__link"
      >
        {{ groupRouters.links[0].translationName }}
      </a>
    </template>
    <template v-else>
      <div
        class="group-menu-links-mobile__title"
        @click="toggleOpenDropdown"
      >
        <span class="group-menu-links-mobile__name">
          {{ groupRouters.groupTranslationName }}
        </span>
        <i class="mdi mdi-chevron-down group-menu-links-mobile__icon" />
      </div>
      <div
        ref="dropdown"
        class="group-menu-links-mobile__dropdown"
      >
        <template
          v-for="(link, id) in groupRouters.links"
          :key="id"
        >
          <router-link
            v-if="link.route"
            class="group-menu-links-mobile__dropdown-link"
            @click="$emit(EVENTS.clickRoute, $event)"
            :to="link.route"
          >
            {{ link.translationName }}
          </router-link>
          <a
            v-else
            :href="link.link"
            target="_blank"
            rel="noopener"
            class="group-menu-links-mobile__dropdown-link"
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
import { computed, ref } from 'vue'

const EVENTS = {
  clickRoute: 'click-route',
}

export default {
  name: 'group-menu-links-mobile',

  props: {
    groupRouters: { type: Object, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props) {
    const dropdown = ref(null)
    const routers = useRoute()
    const isOpenDropdown = ref(false)

    const isActiveRouter = computed(
      () => routers.matched.some(({ name }) =>
        !!props.groupRouters.links.find(link => link.route?.name === name)),
    )

    const toggleOpenDropdown = () => {
      if (isOpenDropdown.value) {
        dropdown.value.style.height = '0px'
      } else {
        dropdown.value.style.height = `${dropdown.value.scrollHeight}px`
      }

      isOpenDropdown.value = !isOpenDropdown.value
    }

    return {
      EVENTS,
      dropdown,
      toggleOpenDropdown,
      isOpenDropdown,
      isActiveRouter,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.group-menu-links-mobile {
  cursor: pointer;

  &--active {
    .group-menu-links-mobile__name,
    .group-menu-links-mobile__icon,
    .group-menu-links-mobile__link {
      color: $col-app-accent;
    }
  }

  &--open {
    .group-menu-links-mobile__dropdown {
      margin-top: 2.4rem;
      opacity: 1;
    }

    .group-menu-links-mobile__icon {
      transform: rotate(180deg);
    }
  }
}

.group-menu-links-mobile__link {
  font-size: 1.6rem;
  line-height: 2rem;
  color: $col-navigation-link;

  &:hover {
    color: $col-app-accent;
  }
}

.group-menu-links-mobile__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-menu-links-mobile__name {
  font-size: 1.6rem;
  line-height: 2rem;
}

.group-menu-links-mobile__icon {
  font-size: 2.5rem;
  line-height: 1;
  margin-left: 1rem;
  transition: all 0.2s linear;
}

.group-menu-links-mobile__dropdown {
  height: 0;
  margin-top: 0;
  opacity: 0;
  border-left: 0.1rem solid $col-app-accent;
  overflow: hidden;
  transition: all 0.2s linear;
}

.group-menu-links-mobile__dropdown-link {
  display: block;
  font-size: 1.6rem;
  padding: 0 1.6rem;
  white-space: nowrap;
  color: $col-navigation-link;

  & + & {
    margin-top: 2.4rem;
  }

  &:hover {
    color: $col-app-accent;
  }
}
</style>
