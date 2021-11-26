import { useCall } from '@/vue/composables'
import { api } from '@api'

const transformVotes = {
  transform: (entries) =>
    entries.reduce((result, [voter, { votes }]) => {
      votes.forEach((candidate) => {
        const address = candidate.toString()

        if (!result[address]) {
          result[address] = []
        }

        result[address].push(voter)
      })

      return result
    }, {}),
}

export function useAllVotes () {
  const allVotes = useCall(api.derive.council.votes, undefined, transformVotes)

  return allVotes
}
