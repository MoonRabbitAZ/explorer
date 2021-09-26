<template>
  <div>
    <!-- eslint-disable max-len -->
    <awakening-temple-icon v-if="ICON_IDS.awakening === stakingTypeId" />
    <exploration-temple-icon v-if="ICON_IDS.exploration === stakingTypeId" />
    <perception-temple-icon v-if="ICON_IDS.perception === stakingTypeId" />
    <enlightenment-temple-icon v-if="ICON_IDS.enlightenment === stakingTypeId" />
    <transcendence-temple-icon v-if="ICON_IDS.transcendence === stakingTypeId" />
    <immortality-temple-icon v-if="ICON_IDS.immortality === stakingTypeId" />

    <!-- eslint-enable max-len -->
  </div>
</template>

<script>
import AwakeningTempleIcon from '@/vue/common/temples-icons/Awakening-temple-icon'
import ExplorationTempleIcon from '@/vue/common/temples-icons/Exploration-temple-icon'
import PerceptionTempleIcon from '@/vue/common/temples-icons/Perception-temple-icon'
import EnlightenmentTempleIcon from '@/vue/common/temples-icons/Enlightenment-temple-icon'
import TranscendenceTempleIcon from '@/vue/common/temples-icons/Transcendence-temple-icon'
import ImmortalityTempleIcon from '@/vue/common/temples-icons/Immortality-temple-icon'

const ICON_IDS = {
  awakening: '1',
  exploration: '2',
  perception: '3',
  enlightenment: '4',
  transcendence: '5',
  immortality: '6',
}

export default {
  name: 'temple-icon',
  components: {
    AwakeningTempleIcon,
    ExplorationTempleIcon,
    PerceptionTempleIcon,
    EnlightenmentTempleIcon,
    TranscendenceTempleIcon,
    ImmortalityTempleIcon,
  },
  props: {
    stakingTypeId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      ICON_IDS,
    }
  },
}
</script>
