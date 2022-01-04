<template>
  <progress-info-block
    :title="$t('common.epoch-time.epoch-title')"
    :total="sessionInfo?.sessionLength"
    :current="sessionInfo?.sessionProgress"
  />
</template>

<script>
import ProgressInfoBlock from '@/vue/common/ProgressInfoBlock'

import { api } from '@api'
import { useCall } from '@/vue/composables'

export default {
  name: 'epoch-time',

  components: {
    ProgressInfoBlock,
  },

  setup () {
    const sessionInfo = useCall(api.derive.session?.progress)

    return { sessionInfo }
  },
}
</script>
