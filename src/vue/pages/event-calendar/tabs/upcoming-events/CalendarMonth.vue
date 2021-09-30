<template>
  <div class="calendar-month">
    <div class="calendar-month__head">
      <h1 class="calendar-month__title">
        {{ $fdmy(dateState.dateMonth) }}
      </h1>
      <div class="calendar-month__actions">
        <button
          class="calendar-month__arrow-button"
          @click="setPrevMonth"
        >
          <i class="mdi mdi-chevron-left calendar-month__arrow-icon"/>
        </button>
        <button
          class="calendar-month__arrow-button"
          @click="setNextMonth"
        >
          <i class="mdi mdi-chevron-right calendar-month__arrow-icon"/>
        </button>
      </div>
    </div>

    <div
      class="calendar-month__body"
      :class="[`calendar-month__start-day-${startDay}`]"
    >
      <div class="calendar-month__days-of-week">
        <div
          v-for="day in dayOfWeekRef"
          :key="`day-of-week-${day}`"
          class="calendar-month__day-of-week"
        >
          {{ day }}
        </div>
      </div>
      <div class="calendar-month__month-days-wrap">
        <month-day
          v-for="day in dateState.days"
          :key="`day-number-${day}`"
          class="calendar-month__month-day"
          :day="day"
          :scheduled="scheduled"
          :date-state="dateState"
          :is-curr-year="isCurrYear"
          :is-curr-month="isCurrMonth"
          @click="setDay(day)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MonthDay from '@event-calendar-page/tabs/upcoming-events/MonthDay'

import { useI18n } from 'vue-i18n'
import { ref, computed, toRefs } from 'vue'
import { DAYS } from '@/js/const/date.const'

export default {
  name: 'calendar-month',

  components: {
    MonthDay,
  },

  props: {
    scheduled: { type: Array, required: true },
    dateState: { type: Object, required: true },
    setDay: { type: Function, required: true },
    setNextMonth: { type: Function, required: true },
    setPrevMonth: { type: Function, required: true },
  },

  setup (props) {
    const { t } = useI18n()
    const { dateState } = toRefs(props)

    const dayOfWeekRef = ref(
      DAYS.map((d) => {
        const translate = t(`formats.daysOfWeek.${d}`)
        return translate.slice(0, 3)
      }),
    )

    const isCurrYear = computed(() =>
      dateState.value.dateMonth.getFullYear() ===
          dateState.value.dateSelected.getFullYear(),
    )

    const isCurrMonth = computed(() =>
      dateState.value.dateMonth.getMonth() ===
        dateState.value.dateSelected.getMonth(),
    )

    const startDay = computed(() =>
      DAYS[dateState.value.dateMonth.getDay()],
    )

    return {
      dayOfWeekRef,
      startDay,
      isCurrMonth,
      isCurrYear,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

.calendar-month {
  max-width: max-content;
}

.calendar-month__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.calendar-month__title {
  text-transform: capitalize;
}

.calendar-month__actions {
  display: flex;
}

.calendar-month__arrow-button {
  & + & {
    margin-left: 1rem;
  }
}

.calendar-month__arrow-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 1;
}

.calendar-month__days-of-week,
.calendar-month__month-days-wrap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font: 1em 'Consolas', sans-serif;
}

.calendar-month__day-of-week {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  text-transform: capitalize;
}

.calendar-month__body {
  padding: 3rem;

  @include content-block;

  &.calendar-month__start-day-sun .calendar-month__month-day:first-child {
    grid-column: 1;
  }

  &.calendar-month__start-day-mon .calendar-month__month-day:first-child {
    grid-column: 2;
  }

  &.calendar-month__start-day-tue .calendar-month__month-day:first-child {
    grid-column: 3;
  }

  &.calendar-month__start-day-wed .calendar-month__month-day:first-child {
    grid-column: 4;
  }

  &.calendar-month__start-day-thu .calendar-month__month-day:first-child {
    grid-column: 5;
  }

  &.calendar-month__start-day-fri .calendar-month__month-day:first-child {
    grid-column: 6;
  }

  &.calendar-month__start-day-sat .calendar-month__month-day:first-child {
    grid-column: 7;
  }
}
</style>
