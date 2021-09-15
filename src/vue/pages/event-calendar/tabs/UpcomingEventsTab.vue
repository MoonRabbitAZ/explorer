<template>
  <div class="upcoming-events-tab app__padding">
    <div class="upcoming-events-tab__body">
      <div class="upcoming-events-tab__calendar-wrap">
        <calendar-month
          :scheduled="scheduled"
          :date-state="dateState"
          :set-day="setDay"
          :set-next-month="setNextMonth"
          :set-prev-month="setPrevMonth"
        />

        <div class="upcoming-events-tab__all-events">
          <div class="upcoming-events-tab__all-events-title app__big-title">
            {{ $t('all-events') }}
          </div>
          <div class="upcoming-events-tab__event-item-wrap">
            <event-item
              v-for="(item, id) in sortedScheduled"
              class="upcoming-events-tab__event-item"
              :key="id"
              :event="item"
              is-full-date
            />
          </div>
        </div>
      </div>
      <selected-day
        class="upcoming-events-tab__selected-day"
        :date-selected="dateState.dateSelected"
        :scheduled="scheduled"
        :set-next-day="setNextDay"
        :set-prev-day="setPrevDay"
      />
    </div>
  </div>
</template>

<script>
import CalendarMonth from '@event-calendar-page/tabs/upcoming-events/CalendarMonth'
import SelectedDay from '@event-calendar-page/tabs/upcoming-events/SelectedDay'
import EventItem from '@event-calendar-page/tabs/upcoming-events/EventItem'

import useScheduled from '@event-calendar-page/composables/useScheduled'
import { getDateState, nextMonth, prevMonth } from '@/js/util/date.util'
import { reactive, onBeforeUnmount, toRefs, computed } from 'vue'

const NOW_INC = 30 * 1000

export default {
  name: 'upcoming-events-tab',

  components: {
    CalendarMonth,
    SelectedDay,
    EventItem,
  },

  setup () {
    const state = reactive({
      dateNow: new Date(),
      dateState: {},
    })
    const scheduled = useScheduled()

    state.dateState = getDateState(state.dateNow, state.dateNow)

    const changeDate = setInterval(() => {
      state.dateNow = new Date()
    }, NOW_INC)

    const sortedScheduled = computed(() =>
      scheduled.value.map(i => i).sort((a, b) => a.dateTime - b.dateTime),
    )

    function setNextMonth () {
      state.dateState = getDateState(
        nextMonth(state.dateState.dateMonth),
        state.dateState.dateSelected,
      )
    }

    function setPrevMonth () {
      state.dateState = getDateState(
        prevMonth(state.dateState.dateMonth),
        state.dateState.dateSelected,
      )
    }

    function setNextDay () {
      const date = new Date(state.dateState.dateSelected)
      date.setDate(date.getDate() + 1)

      state.dateState = getDateState(date, date)
    }

    function setPrevDay () {
      const date = new Date(state.dateState.dateSelected)
      date.setDate(date.getDate() - 1)
      state.dateState = getDateState(date, date)
    }

    function setDay (day) {
      const date = new Date(state.dateState.dateMonth)
      date.setDate(day)
      state.dateState = getDateState(date, date)
    }

    onBeforeUnmount(() => {
      clearInterval(changeDate)
    })

    return {
      ...toRefs(state),
      sortedScheduled,
      setNextMonth,
      setPrevMonth,
      setNextDay,
      setPrevDay,
      setDay,
      scheduled,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.upcoming-events-tab__body {
  width: 100%;
  display: flex;

  @include respond-to($sidebar-hide-bp) {
    flex-direction: column;
    align-items: center;
  }
}

.upcoming-events-tab__selected-day {
  margin-left: 4rem;

  @include respond-to($sidebar-hide-bp) {
    margin-left: 0;
    margin-top: 2rem;
  }
}

.upcoming-events-tab__all-events {
  margin-top: 2rem;

  @include respond-to($sidebar-hide-bp) {
    display: none;
  }
}

.upcoming-events-tab__all-events-title {
  margin-bottom: 2rem;
}

.upcoming-events-tab__event-item-wrap {
  overflow-y: auto;
  max-height: 50vh;

  @include scrollbar;
}

.upcoming-events-tab__event-item {
  & + & {
    margin-top: 0.4rem;
  }
}
</style>

<i18n>
{
  "en": {
    "all-events": "All events"
  }
}
</i18n>
