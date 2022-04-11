<template>
  <div
    class="value-displayer"
    :class="[
      `value-displayer--text-lvl-${valueLevel}`,
      ...(isMediumIndent ? ['value-displayer--medium-indent'] : [])
    ]"
  >
    <h1
      v-if="headerLevel === HEADER_LEVELS.lvl1"
      class="value-displayer__header"
    >
      {{ header }}
    </h1>
    <h2
      v-else-if="headerLevel === HEADER_LEVELS.lvl2"
      class="value-displayer__header"
    >
      {{ header }}
    </h2>
    <h3
      v-else-if="headerLevel === HEADER_LEVELS.lvl3"
      class="value-displayer__header"
    >
      {{ header }}
    </h3>
    <h4
      v-else-if="headerLevel === HEADER_LEVELS.lvl4"
      class="value-displayer__header"
    >
      {{ header }}
    </h4>
    <h5
      v-else-if="headerLevel === HEADER_LEVELS.lvl5"
      class="value-displayer__header"
    >
      {{ header }}
    </h5>
    <h6
      v-else-if="headerLevel === HEADER_LEVELS.lvl6"
      class="value-displayer__header"
    >
      {{ header }}
    </h6>

    <skeleton-loader
      v-if="value === undefined || value === null"
      class="value-displayer__skeleton"
    />
    <template v-else>
      <template v-if="isSlotDisplay(SLOTS.default)">
        <div class="value-displayer__value">
          <slot />
        </div>
      </template>

      <router-link
        v-else-if="route"
        v-tooltip="tooltip"
        class="value-displayer__value value-displayer__link"
        :class="{'value-displayer__value--full': isFullValue }"
        :to="route"
      >
        {{ value }}
      </router-link>

      <p
        v-else
        v-tooltip="tooltip"
        class="value-displayer__value"
        :class="{'value-displayer__value--full': isFullValue }"
      >
        {{ value }}
      </p>
    </template>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/SkeletonLoader'
import { oneOf } from '@/js/helpers/type-validators'

const SLOTS = { default: 'default' }

const HEADER_LEVELS = {
  lvl1: 1,
  lvl2: 2,
  lvl3: 3,
  lvl4: 4,
  lvl5: 5,
  lvl6: 6,
}

const VALUE_LEVELS = {
  lvl1: 1,
  lvl2: 2,
  lvl3: 3,
  lvl4: 4,
  lvl5: 5,
  lvl6: 6,
}

export default {
  name: 'value-displayer',

  components: { SkeletonLoader },

  props: {
    headerLevel: {
      type: Number,
      default: 3,
      validator: oneOf(HEADER_LEVELS),
    },
    valueLevel: {
      type: Number,
      default: 3,
      validator: oneOf(VALUE_LEVELS),
    },
    header: { type: String, required: true },
    value: { type: [String, Number], default: null },
    route: { type: Object, default: null },
    isMediumIndent: { type: Boolean, default: false },
    tooltip: { type: String, default: '' },
    isFullValue: { type: Boolean, default: true },
  },

  setup (_, { slots }) {
    function isSlotDisplay (slotName) {
      return Boolean(slots[slotName])
    }

    return {
      isSlotDisplay,
      SLOTS,
      HEADER_LEVELS,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

$font-size-text-level-1: 2rem;
$font-size-text-level-2: 1.8rem;
$font-size-text-level-3: 1.6rem;
$font-size-text-level-4: 1.4rem;
$font-size-text-level-5: 1.2rem;
$font-size-text-level-6: 1rem;

.value-displayer {
  overflow: hidden;

  &--text-lvl-1 {
    .value-displayer__value {
      font-size: $font-size-text-level-1;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-1 * $app-text-line-height;
    }
  }

  &--text-lvl-2 {
    .value-displayer__value {
      font-size: $font-size-text-level-2;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-2 * $app-text-line-height;
    }
  }

  &--text-lvl-3 {
    .value-displayer__value {
      font-size: $font-size-text-level-3;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-3 * $app-text-line-height;
    }
  }

  &--text-lvl-4 {
    .value-displayer__value {
      font-size: $font-size-text-level-4;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-4 * $app-text-line-height;
    }
  }

  &--text-lvl-5 {
    .value-displayer__value {
      font-size: $font-size-text-level-5;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-5 * $app-text-line-height;
    }
  }

  &--text-lvl-6 {
    .value-displayer__value {
      font-size: $font-size-text-level-6;
    }

    .value-displayer__skeleton {
      height: $font-size-text-level-6 * $app-text-line-height;
    }
  }

  &--medium-indent {
    .value-displayer__header {
      margin-bottom: 0.6rem;
    }
  }
}

.value-displayer__header {
  color: $col-app-header-secondary;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.value-displayer__value {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  white-space: nowrap;
  width: max-content;

  &--full {
    overflow: visible;
    white-space: normal;
    word-break: break-word;
  }
}

.value-displayer__link {
  @include link-primary;
}
</style>
