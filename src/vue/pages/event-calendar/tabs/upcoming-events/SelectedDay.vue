<template>
  <div class="selected-day">
    <div class="selected-day__head">
      <h1 class="selected-day__title">
        {{ $fd(dateSelected) }}
      </h1>
      <div class="selected-day__actions">
        <button
          class="selected-day__arrow-button"
          @click="setPrevDay"
        >
          <i class="mdi mdi-chevron-left selected-day__arrow-icon"/>
        </button>
        <button
          class="selected-day__arrow-button"
          @click="setNextDay"
        >
          <i class="mdi mdi-chevron-right selected-day__arrow-icon"/>
        </button>
      </div>
    </div>

    <div class="selected-day__body">
      <day-hour
        class="selected-day__day-hour"
        v-for="hour in HOURS_OF_DAY"
        :key="hour"
        :hour="hour"
        :date-selected="dateSelected"
        :scheduled="scheduled"
      />
    </div>
  </div>
</template>

<script>
import DayHour from '@event-calendar-page/tabs/upcoming-events/DayHour'

const HOURS_OF_DAY = Array(24).fill(1).map((_, index) => index)

export default {
  name: 'selected-day',

  components: {
    DayHour,
  },

  props: {
    dateSelected: { type: Object, required: true },
    scheduled: { type: Array, required: true },
    setNextDay: { type: Function, required: true },
    setPrevDay: { type: Function, required: true },
  },

  setup () {
    return {
      HOURS_OF_DAY,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.selected-day {
  width: 100%;
}

.selected-day__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.selected-day__title {
  text-transform: capitalize;
}

.selected-day__actions {
  display: flex;
}

.selected-day__arrow-button {
  & + & {
    margin-left: 1rem;
  }
}

.selected-day__arrow-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 1;
}

.selected-day__body {
  max-height: 50vh;
  overflow-y: auto;

  @include scrollbar;
}

.selected-day__day-hour {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
