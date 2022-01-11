const validProposalNames = {
  Active: ['closeBounty', 'unassignCurator'],
  Approved: [],
  CuratorProposed: ['closeBounty', 'unassignCurator'],
  Funded: ['proposeCurator', 'closeBounty'],
  PendingPayout: ['unassignCurator'],
  Proposed: ['approveBounty', 'closeBounty'],
}

export function getProposalToDisplay (bountyProposals, status) {
  const method = bestValidProposalName(bountyProposals, status)

  return getProposalByMethod(bountyProposals, method) ?? null
}

function validMethods (status) {
  return validProposalNames[status.type]
}

function getProposalByMethod (bountyProposals, method) {
  return bountyProposals.find(({ proposal }) => proposal.method === method)
}

function bestValidProposalName (bountyProposals, status) {
  const methods = bountyProposals.map(({ proposal }) => proposal.method)

  return validMethods(status).find((method) => methods.includes(method))
}
