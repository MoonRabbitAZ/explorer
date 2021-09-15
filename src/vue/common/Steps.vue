<template>
  <div class="steps">
    <button
      v-for="step in stepsCount"
      :key="`step-${step}`"
      class="steps__step"
      :class="{'steps__step--active': currentStep === step}"
      :disabled="currentStep < step"
      @click="changeStep(step)"
    >
      <h4>
        {{ $t('step-title', { number: step}) }}
      </h4>
    </button>
  </div>
</template>

<script>

const EVENTS = {
  updateCurrentStep: 'update:current-step',
}

export default {
  name: 'steps',

  props: {
    stepsCount: { type: Number, required: true },
    currentStep: { type: Number, required: true },
  },

  emits: Object.values(EVENTS),

  setup (_, { emit }) {
    function changeStep (step) {
      emit(EVENTS.updateCurrentStep, step)
    }

    return { changeStep }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.steps {
  display: flex;
  justify-content: space-between;
}

.steps__step {
  padding-right: 0.5rem;
  padding-bottom: 1rem;
  position: relative;
  color: $col-app-text;

  & + & {
    margin-left: 3.6rem;
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.2rem;
    border-radius: 0.4rem;
    background: $col-app-text;
  }

  &[disabled] {
    color: $col-app-header-secondary;

    &:after {
      background: $col-app-header-secondary;
    }
  }

  &--active {
    color: $col-app-accent;

    &:after {
      background: $col-app-accent;
    }
  }
}
</style>

<i18n>
{
  "en": {
    "step-title": "Step { number }",
  }
}
</i18n>
