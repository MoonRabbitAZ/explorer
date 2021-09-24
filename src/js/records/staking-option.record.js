import _get from 'lodash/get'

export class StakingOptionRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.period = _get(record, 'minRetrievalPeriod', '')
    this.rewardFraction = _get(record, 'rewardFraction', '')
    this.type = _get(record, 'stakingType', '')
    this.status = _get(record, 'status', '')
  }

  get nameTranslationId () {
    return `staking-options.types.type-${this.id}`
  }
}
