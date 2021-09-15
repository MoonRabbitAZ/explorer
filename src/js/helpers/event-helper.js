export const filterEvent = (method, section) => {
  return section !== 'system' &&
  (!['balances', 'treasury'].includes(section) || !['Deposit'].includes(method)) &&
  (!['parasInclusion', 'inclusion'].includes(section) || !['CandidateBacked', 'CandidateIncluded'].includes(method))
}
