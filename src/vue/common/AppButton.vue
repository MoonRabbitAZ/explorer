<template>
  <button
    v-bind="$attrs"
    v-ripple
    :type="$attrs.type || 'button'"
    :aria-label="text"
    class="app-button"
    :class="[
      {
        'app-button--rounded': isRounded,
        'app-button--only-icon': !text
      },
      scheme ? `app-button--${scheme}` : '',
      size ? `app-button--${size}` : ''
    ]"
  >
    <template v-if="iconName">
      <icon
        class="app-button__icon"
        :name="iconName"
      />
    </template>
    <template v-else-if="mdiIconName">
      <i
        class="mdi app-button__icon"
        :class="[mdiIconName]"
      />
    </template>
    {{ text }}
  </button>
</template>

<script>
import Icon from '@/vue/common/Icon'
import { oneOf } from '@/js/helpers/type-validators'

const SCHEME = {
  primary: 'primary',
  secondary: 'secondary',
  default: '',
}

const SIZE = {
  big: 'big',
  medium: 'medium',
  small: 'small',
  xSmall: 'x-small',
}

export default {
  name: 'app-button',

  components: { Icon },

  props: {
    scheme: {
      type: String,
      default: SCHEME.default,
      validator: oneOf(SCHEME),
    },
    size: {
      type: String,
      default: SIZE.medium,
      validator: oneOf(SIZE),
    },
    isRounded: { type: Boolean, default: false },
    iconName: { type: String, default: '' },
    mdiIconName: { type: String, default: '' },
    text: { type: String, default: '' },
  },

  setup () {
    return {
      SCHEME,
      SIZE,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.app-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  background-color: transparent;
  width: inherit;
  height: inherit;
  border-radius: 0.4rem;
  border: none;
  line-height: 1;
  white-space: nowrap;

  &[disabled] {
    color: $col-app-secondary;
    cursor: not-allowed;
  }

  // SCHEMES
  &--primary {
    background: $col-app-accent;
    color: $col-app-text-dark;

    &[disabled] {
      color: $col-app-text-dark;
      background: $col-app-button-disabled;
    }

    &:not([disabled]):hover {
      box-shadow: $app-button-hover-shadow;
    }
  }

  &--secondary {
    background: transparent;
    color: $col-app-accent;
    border: 0.2rem solid $col-app-accent;

    &[disabled] {
      color: $col-app-button-disabled;
      border: 0.2rem solid $col-app-button-disabled;
    }

    &:not([disabled]):hover {
      box-shadow: $app-button-hover-shadow;
    }
  }

  // SIZE
  &--big {
    height: 5.6rem;
    min-width: 5.6rem;
    font-size: 2rem;
    padding: 0 2.4rem;

    .app-button__icon {
      font-size: 2.4rem;
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  &--medium {
    height: 4.4rem;
    min-width: 4.4rem;
    font-size: 1.6rem;
    padding: 0 1.6rem;

    .app-button__icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }
  }

  &--small {
    height: 3.6rem;
    min-width: 3.6rem;
    font-size: 1.6rem;
    padding: 0 0.53rem;

    .app-button__icon {
      font-size: 1.33rem;
      width: 1.33rem;
      height: 1.33rem;
    }
  }

  &--x-small {
    height: 2.4rem;
    min-width: 2.4rem;
    font-size: 1.6rem;
    padding: 0 0.53rem;

    .app-button__icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  &--rounded {
    border-radius: 3.2rem;
  }

  &--only-icon {
    padding: 0;

    .app-button__icon {
      margin: 0;
    }
  }
}

.app-button__icon {
  margin-right: 0.5rem;
}
</style>
