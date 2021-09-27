import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import { BCH_EVENT_TYPES } from '@/js/const/blockchain-event.const'

export function useEventTranslation (type, id) {
  const { t } = useI18n()
  const state = reactive({
    messageEventTranslation: '',
    linkEventTranslation: '',
  })

  switch (type) {
    case BCH_EVENT_TYPES.councilElection:
      state.messageEventTranslation = t('blockchain-events.messages.council-election')
      state.linkEventTranslation = t('blockchain-events.links.council-election')
      break

    case BCH_EVENT_TYPES.councilMotion:
      state.messageEventTranslation = t('blockchain-events.messages.council-motion', { id })
      state.linkEventTranslation = t('blockchain-events.links.council-motion')
      break

    case BCH_EVENT_TYPES.democracyDispatch:
      state.messageEventTranslation = t('blockchain-events.messages.democracy-dispatch', { id })
      state.linkEventTranslation = t('blockchain-events.links.democracy-dispatch')
      break

    case BCH_EVENT_TYPES.democracyLaunch:
      state.messageEventTranslation = t('blockchain-events.messages.democracy-launch')
      state.linkEventTranslation = t('blockchain-events.links.democracy-launch')
      break

    case BCH_EVENT_TYPES.parachainAuction:
      state.messageEventTranslation = toolbar('blockchain-events.messages.parachain-auction', { id })
      state.linkEventTranslation = t('blockchain-events.links.parachain-auction')
      break

    case BCH_EVENT_TYPES.parachainLease:
      state.messageEventTranslation = t('blockchain-events.messages.parachain-lease', { id })
      state.linkEventTranslation = t('blockchain-events.links.parachain-lease')
      break

    case BCH_EVENT_TYPES.referendumDispatch:
      state.messageEventTranslation = t('blockchain-events.messages.referendum-dispatch', { id })
      state.linkEventTranslation = t('blockchain-events.links.referendum-dispatch')
      break

    case BCH_EVENT_TYPES.referendumVote:
      state.messageEventTranslation = t('blockchain-events.messages.referendum-vote', { id })
      state.linkEventTranslation = t('blockchain-events.links.referendum-vote')
      break

    case BCH_EVENT_TYPES.scheduler:
      state.messageEventTranslation = id
        ? t('blockchain-events.messages.scheduler', { id })
        : t('blockchain-events.messages.scheduler-anonymous')
      state.linkEventTranslation = t('blockchain-events.links.rscheduler')
      break

    case BCH_EVENT_TYPES.stakingEpoch:
      state.messageEventTranslation = t('blockchain-events.messages.staking-epoch', { id })
      state.linkEventTranslation = t('blockchain-events.links.staking-epoch')
      break

    case BCH_EVENT_TYPES.stakingEra:
      state.messageEventTranslation = t('blockchain-events.messages.staking-era', { id })
      state.linkEventTranslation = t('blockchain-events.links.staking-era')
      break

    case BCH_EVENT_TYPES.stakingSlash:
      state.messageEventTranslation = t('blockchain-events.messages.staking-slash', { id })
      state.linkEventTranslation = t('blockchain-events.links.staking-slash')
      break

    case BCH_EVENT_TYPES.treasurySpend:
      state.messageEventTranslation = t('blockchain-events.messages.treasury-spend')
      state.linkEventTranslation = t('blockchain-events.links.treasury-spend')
      break

    case BCH_EVENT_TYPES.societyChallenge:
      state.messageEventTranslation = t('blockchain-events.messages.society-challenge')
      state.linkEventTranslation = t('blockchain-events.links.society-challenge')
      break

    case BCH_EVENT_TYPES.societyRotate:
      state.messageEventTranslation = t('blockchain-events.messages.society-rotate')
      state.linkEventTranslation = t('blockchain-events.links.society-rotate')
      break

    default:
      throw new Error(t('errors.blockchain-event-type', { type }))
  }

  return state
}
