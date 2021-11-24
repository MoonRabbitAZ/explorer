<template>
  <div class="progress-bar">
    <template v-if="current && total">
      <div class="progress-bar__content">
        <div class="progress-bar__clip-first">
          <div
            class="progress-bar__slice"
            :style="{ 'transform': `rotate(${firstHalfAngle}deg)` }"
          />
        </div>
        <div class="progress-bar__clip-second">
          <div
            class="progress-bar__slice"
            :style="{ 'transform': `rotate(${secondHalfAngle}deg)` }"
          />
        </div>
        <div class="progress-bar__status">
          {{ `${progressPercent}%` }}
        </div>
      </div>
    </template>
    <template v-else>
      <skeleton-loader class="progress-bar__skeleton-loader"/>
    </template>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { ref, watch } from 'vue'
import { BN } from '@polkadot/util'

export default {
  name: 'progress-bar',

  components: { SkeletonLoader },

  props: {
    current: { type: BN, default: null },
    total: { type: BN, default: null },
  },

  setup (props) {
    const progressPercent = ref(0) // percent
    const firstHalfAngle = ref(0)
    const secondHalfAngle = ref(0)

    function calcProgress () {
      if (props.current && props.total) {
        const angle = props.total.isZero()
          ? 0
          : props.current.muln(36000).div(props.total).toNumber() / 100
        const drawAngle = angle % 360

        firstHalfAngle.value = drawAngle <= 180
          ? drawAngle
          : 180

        secondHalfAngle.value = drawAngle <= 180
          ? 0
          : drawAngle - 180

        progressPercent.value = Math.floor(angle * 100 / 360)
      }
    }

    watch(() => [props.current, props.total], calcProgress, { immediate: true })

    return {
      firstHalfAngle,
      secondHalfAngle,
      progressPercent,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

$progress-bar-half-size: $progress-bar-size / 2;
$progress-clip-rect-1: rect(
  0,
  $progress-bar-size,
  $progress-bar-size,
  $progress-bar-half-size
);
$progress-clip-rect-2: rect(
  0,
  $progress-bar-half-size,
  $progress-bar-size,
  0
);

.progress-bar__content {
  background-color: $col-progress-bar-bg;
  width: $progress-bar-size;
  height: $progress-bar-size;
  border-radius: 50%;
  position: relative;
}

.progress-bar__clip-first,
.progress-bar__clip-second {
  position: absolute;
  top: 0;
  left: 0;
}

.progress-bar__clip-first {
  clip: $progress-clip-rect-1;

  .progress-bar__slice {
    clip: $progress-clip-rect-2;
  }
}

.progress-bar__clip-second {
  clip: $progress-clip-rect-2;

  .progress-bar__slice {
    clip: $progress-clip-rect-1;
  }
}

.progress-bar__slice {
  position: absolute;
  width: $progress-bar-size;
  height: $progress-bar-size;
  border-radius: 50%;
  background-color: $col-progress-bar-slice-bg;
  zoom: 1;
}

.progress-bar__status {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: $progress-bar-status-size;
  width: $progress-bar-status-size;
  top: 50%;
  left: 50%;
  background: $col-progress-bar-status-bg;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.progress-bar__skeleton-loader {
  width: $progress-bar-size;
  height: $progress-bar-size;
}
</style>
