<template>
  <button
    class="month-day"
    :class="{'month-day--selected': isSelectedDay}"
  >
    <div
      v-if="hasEvents"
      class="month-day__event-indicator"
    />
    <span class="month-day__day">
      {{ day }}
    </span>
  </button>
</template>

<script>
import { computed, toRefs } from 'vue'

const DAY_TO_MS = 24 * 60 * 60 * 1000

export default {
  name: 'month-day',

  props: {
    day: { type: Number, required: true },
    scheduled: { type: Array, required: true },
    dateState: { type: Object, required: true },
    isCurrYear: { type: Boolean, default: false },
    isCurrMonth: { type: Boolean, default: false },
  },

  setup (props) {
    const { dateState, day, isCurrMonth, isCurrYear, scheduled } = toRefs(props)

    const isSelectedDay = computed(() =>
      isCurrYear.value && isCurrMonth.value && day.value ===
        dateState.value.dateSelected.getDate(),
    )

    const hasEvents = computed(() => {
      const start =
        dateState.value.dateMonth.getTime() + ((day.value - 1) * DAY_TO_MS)
      const end = start + DAY_TO_MS

      return scheduled.value.some(
        ({ dateTime }) => dateTime >= start && dateTime < end,
      )
    })

    return {
      hasEvents,
      isSelectedDay,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

.month-day {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  color: $col-app-accent;
  border: 0.1rem solid transparent;

  &:hover {
    border: 0.1rem solid $col-app-accent;
    cursor: pointer;
  }

  &--selected {
    color: $col-app-text-dark;
    background: $col-app-accent;

    .month-day__event-indicator {
      background: $col-app-text-dark;
    }
  }
}

.month-day__event-indicator {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: $col-app-accent;
  margin-bottom: 0.2rem;
}

.month-day__day {
  font-size: 1.6rem;
}
</style>
