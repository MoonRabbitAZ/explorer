<template>
  <div
    class="expander"
    :class="{
      'expander--open': isOpenDropdown,
      'expander--in-drawer': isInDrawer,
    }"
  >
    <div
      class="expander__header"
      @click="toggleOpenDropdown"
    >
      <div class="expander__title">
        {{ title }}
      </div>
      <div
        v-if="isSubtitleDisplay"
        class="expander__subtitle"
      >
        <template v-if="subtitle">
          {{ subtitle }}
        </template>
        <template v-else-if="isSlotDisplay(SLOTS.subtitle)">
          <slot :name="SLOTS.subtitle"/>
        </template>
      </div>
      <i class="mdi mdi-chevron-down expander__icon-arrow"/>
    </div>
    <div
      v-if="isSlotDisplay(SLOTS.description)"
      class="expander__description"
    >
      <slot :name="SLOTS.description"/>
    </div>
    <div
      ref="dropdown"
      class="expander__dropdown"
    >
      <div
        v-if="isSlotDisplay(SLOTS.dropdownMain)"
        class="expander__dropdown-main"
      >
        <slot :name="SLOTS.dropdownMain"/>
      </div>
      <div
        class="expander__dropdown-secondary"
        v-if="isSlotDisplay(SLOTS.secondary)"
      >
        <slot :name="SLOTS.secondary"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

const SLOTS = {
  dropdownMain: 'dropdown-main',
  secondary: 'secondary',
  default: 'default',
  subtitle: 'subtitle',
  description: 'description',
}

export default {
  name: 'expander',

  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    isInDrawer: { type: Boolean, default: false },
  },

  setup (props, { slots }) {
    const dropdown = ref(null)
    const isOpenDropdown = ref(false)

    function isSlotDisplay (slotName) {
      return Boolean(slots[slotName])
    }

    const isSubtitleDisplay = computed(() =>
      Boolean(props.subtitle || isSlotDisplay(SLOTS.subtitle)),
    )

    function toggleOpenDropdown () {
      if (isOpenDropdown.value) {
        dropdown.value.style.height = '0px'
      } else {
        dropdown.value.style.height = `${dropdown.value.scrollHeight}px`
      }

      isOpenDropdown.value = !isOpenDropdown.value
    }

    return {
      dropdown,
      isOpenDropdown,
      isSubtitleDisplay,
      toggleOpenDropdown,
      isSlotDisplay,
      SLOTS,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.expander {
  &--open {
    .expander__icon-arrow {
      transform: translateY(-50%) rotate(180deg);
    }

    .expander__dropdown {
      margin-top: 1.6rem;
      opacity: 1;
    }
  }

  &--in-drawer {
    background: $col-app-block-bg;
    padding: 1.8rem $drawer-padding;

    .expander__title {
      color: $col-app-text;
      font-size: 1.6rem;
    }
  }
}

.expander__header {
  position: relative;
  padding-right: 4rem;
  cursor: pointer;
}

.expander__title {
  color: $col-app-accent;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expander__subtitle {
  margin-top: 1rem;
}

.expander__description {
  margin-top: 1rem;
}

.expander__icon-arrow {
  position: absolute;
  display: flex;
  font-size: 2.4rem;
  top: 50%;
  right: 0.8rem;
  transform: translateY(-50%) rotate(0);
  transition: 0.2s all linear;
}

.expander__dropdown {
  opacity: 0;
  height: 0;
  overflow: hidden;
  margin-top: 0;
  transition: 0.2s all linear;
}

.expander__dropdown-main {
  padding: 0 0 0.5rem 3rem;
  border-left: 0.3rem solid $col-app-accent;
  overflow-x: auto;

  @include scrollbar;

  & + .expander__dropdown-secondary {
    margin-top: 1.6rem;
  }
}
</style>
