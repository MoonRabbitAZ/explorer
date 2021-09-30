import moment from 'moment-timezone'
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'

export function useFormatDate () {
  const { t } = useI18n()

  const calendar = reactive({
    sameDay: t('formats.dates.calendar.sameDay'),
    lastDay: t('formats.dates.calendar.lastDay'),
    nextDay: t('formats.dates.calendar.nextDay'),
    lastWeek: t('formats.dates.calendar.lastWeek'),
    nextWeek: t('formats.dates.calendar.nextWeek'),
    sameElse: t('formats.dates.calendar.sameElse'),
  })
  const calendarInline = reactive({
    sameDay: t('formats.dates.calendarInline.sameDay'),
    lastDay: t('formats.dates.calendarInline.lastDay'),
    nextDay: t('formats.dates.calendarInline.nextDay'),
    lastWeek: t('formats.dates.calendarInline.lastWeek'),
    nextWeek: t('formats.dates.calendarInline.nextWeek'),
    sameElse: t('formats.dates.calendarInline.sameElse'),
  })

  const formatDate = val => moment(val).format(t('formats.dates.date'))
  const formatDateMY = val => moment(val).format(t('formats.dates.my'))
  const formatDateDDMY = val => moment(val).format(t('formats.dates.ddmy'))
  const formatDateDMY = val => moment(val).format(t('formats.dates.dmy'))
  const formatDateDMYT = val => moment(val).format(t('formats.dates.dmyt'))
  const formatCalendar = val => moment(val).calendar(null, calendar)
  const formatCalendarInline = val => moment(val).calendar(null, calendarInline)

  return {
    formatDate,
    formatDateMY,
    formatDateDMY,
    formatDateDDMY,
    formatDateDMYT,
    formatCalendar,
    formatCalendarInline,
  }
}
