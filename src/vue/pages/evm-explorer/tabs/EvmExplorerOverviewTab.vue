<template>
  <div class="evm-explorer-overview-tab">
    {{ result }}
  </div>
</template>

<script>
import { useQuery } from '@vue/apollo-composable'
import GET_BLOCK from '@/graphql/queries/getBlock.gql'

export default {
  name: 'evm-explorer-overview-tab',

  setup () {
    const HURDCODE_BLOCK_NUMBER = 1
    const { result } = useQuery(GET_BLOCK, { number: HURDCODE_BLOCK_NUMBER })

    return {
      result,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

</style>
