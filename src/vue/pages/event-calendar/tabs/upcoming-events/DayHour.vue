<template>
  <div
    class="day-hour"
    :key="+dateSelected"
  >
    <div class="day-hour__hour">
      {{ hourTime }}
    </div>
    <template v-if="filtredScheduled.length">
      <div class="day-hour__events-items-wrap">
        <event-item
          v-for="(item, id) in filtredScheduled"
          class="day-hour__event-item"
          :key="id"
          :event="item"
        />
      </div>
    </template>
    <template v-else>
      <div class="day-hour__empty app__content-block" />
    </template>
  </div>
</template>

<script>
import EventItem from '@event-calendar-page/tabs/upcoming-events/EventItem'

import { ref, toRefs, computed } from 'vue'
import moment from 'moment'

export default {
  name: 'day-hour',

  components: {
    EventItem,
  },

  props: {
    hour: { type: Number, required: true },
    dateSelected: { type: Object, required: true },
    scheduled: { type: Array, required: true },
  },

  setup (props) {
    const { hour, dateSelected, scheduled } = toRefs(props)
    const hourTime = ref(
      hour.value < 10
        ? `0${hour.value}:00`
        : `${hour.value}:00`,
    )

    const filtredScheduled = computed(() => {
      const start = moment(dateSelected.value).add(hour.value, 'hours')
      const end = moment(start).add(1, 'hours')

      return scheduled.value
        .filter(({ dateTime }) => {
          return start.isBefore(dateTime) && end.isAfter(dateTime)
        },
        )
        .sort((a, b) =>
          (a.dateTime - b.dateTime) || a.type.localeCompare(b.type))
    })

    return {
      hourTime,
      filtredScheduled,
    }
  },
}
</script>

<style lang="scss" scoped>
.day-hour {
  display: flex;
}

.day-hour__hour {
  line-height: 2.2rem;
  margin-right: 2rem;
}

.day-hour__events-items-wrap {
  width: 100%;
}

.day-hour__event-item {
  & + & {
    margin-top: 0.4rem;
  }
}

.day-hour__empty {
  width: 100%;
  height: 2rem;
}
</style>
