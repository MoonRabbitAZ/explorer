<template>
  <div>
    <!-- eslint-disable max-len -->
    <copy-icon v-if="ICON_NAMES.copy === name" />
    <money-stack-icon v-if="ICON_NAMES.moneyStack === name" />
    <paper-plane-icon v-if="ICON_NAMES.paperPlane === name" />
    <alert-icon v-if="ICON_NAMES.alert === name" />
    <!-- eslint-enable max-len -->
  </div>
</template>

<script>
import CopyIcon from '@/vue/common/icons/Copy-icon'
import MoneyStackIcon from '@/vue/common/icons/Money-stack-icon'
import PaperPlaneIcon from '@/vue/common/icons/Paper-plane-icon'
import AlertIcon from '@/vue/common/icons/Alert-icon'

const ICON_NAMES = {
  copy: 'copy',
  moneyStack: 'money-stack',
  paperPlane: 'paper-plane',
  alert: 'alert',
}

export default {
  name: 'icon',
  components: {
    CopyIcon,
    MoneyStackIcon,
    PaperPlaneIcon,
    AlertIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      ICON_NAMES,
    }
  },
}
</script>
