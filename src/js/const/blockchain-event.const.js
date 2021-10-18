// BCH - blockchain

export const BCH_EVENT_TYPES = Object.freeze({
  councilElection: 'council-election',
  councilMotion: 'council-motion',
  democracyDispatch: 'democracy-dispatch',
  democracyLaunch: 'democracy-launch',
  parachainAuction: 'parachain-auction',
  parachainLease: 'parachain-lease',
  referendumDispatch: 'referendum-dispatch',
  referendumVote: 'referendum-vote',
  scheduler: 'scheduler',
  stakingEpoch: 'staking-epoch',
  stakingEra: 'staking-era',
  stakingSlash: 'staking-slash',
  treasurySpend: 'treasury-spend',
  societyChallenge: 'society-challenge',
  societyRotate: 'society-rotate',
})

export const BCH_EVENT_METHODS = Object.freeze({
  extrinsicSuccess: 'ExtrinsicSuccess',
  extrinsicFailed: 'ExtrinsicFailed',
  deposit: 'Deposit',
  transfer: 'Transfer',
  candidateBacked: 'CandidateBacked',
  candidateIncluded: 'CandidateIncluded',
})

export const BCH_EVENT_SECTION = Object.freeze({
  system: 'system',
  balances: 'balances',
  treasury: 'treasury',
  parasInclusion: 'parasInclusion',
  inclusion: 'inclusion',
})
