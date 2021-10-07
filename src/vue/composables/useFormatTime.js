import { extractTime } from '@polkadot/util'
import { useI18n } from 'vue-i18n'

export function useFormatTime () {
  const { t } = useI18n()

  function formatDuration (value, isShortTime = false) {
    const { days, hours, minutes, seconds } = extractTime(Math.abs(value))

    const timeArr = [
      ...(days ? [t('formats.time.days', { days })] : []),
      ...(hours ? [t('formats.time.hours', { hours })] : []),
      ...(minutes ? [t('formats.time.minutes', { minutes })] : []),
      ...(seconds ? [t('formats.time.seconds', { seconds })] : []),
    ]
    return isShortTime
      ? timeArr.slice(0, 2).join(' ') || t('formats.time.seconds', { seconds })
      : timeArr.join(' ') || t('formats.time.seconds', { seconds })
  }

  return { formatDuration }
}
