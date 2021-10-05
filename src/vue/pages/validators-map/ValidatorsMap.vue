<template>
  <div class="validators-map">
    <chain-info-blocks class="validators-map__chain-info-blocks"/>

    <div class="validators-map__body">
      <div class="validators-map__map-wrap">
        <img
          ref="worldMap"
          className="validators-map__map-img"
          src="@static/images/world-map.svg"
          @load="onResize"
        >
        <validator-locator
          v-for="(position, id) in locatorsPositionList"
          :key="id"
          :position-top="position.top"
          :position-left="position.left"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ValidatorLocator from '@/vue/pages/validators-map/ValidatorLocator'
import ChainInfoBlocks from '@explorer-page/tabs/chain-info/ChainInfoBlocks'

import { ref, reactive, toRefs, onMounted, onBeforeUnmount } from 'vue'
import { VALIDATORS_LOCATIONS } from '@/js/const/validators-locations.const'

const MAP_HEIGHT_ADJUST = 400 / 360

export default {
  name: 'validators-map',

  components: { ValidatorLocator, ChainInfoBlocks },

  setup () {
    const worldMap = ref(null)
    const state = reactive({
      mapWidth: 0,
      mapHeight: 0,
      locatorsPositionList: [],
    })

    function pixelPosition ({ lat, lon }, state) {
      // Longitude ranges -180 (west) to +180 (east)
      // Latitude ranges +90 (north) to -90 (south)
      const left = Math.round(((180 + lon) / 360) * state.mapWidth)
      const top = Math.round(
        ((90 - lat) / 180) * state.mapHeight * MAP_HEIGHT_ADJUST,
      )

      return { left, top }
    }

    function onResize () {
      state.mapWidth = worldMap.value.scrollWidth
      state.mapHeight = worldMap.value.scrollHeight

      state.locatorsPositionList = VALIDATORS_LOCATIONS.map(item => {
        const { lat, lon } = item

        return pixelPosition({ lat, lon }, state)
      })
    };

    onMounted(() => {
      onResize()
      window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => { window.removeEventListener('resize', onResize) })

    return {
      ...toRefs(state),
      worldMap,
      onResize,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.validators-map {
  margin-top: 3rem;

  @include app-padding;
}

.validators-map__chain-info-blocks {
  margin-bottom: 2rem;
}

.validators-map__body {
  width: 100%;
  overflow-x: auto;

  @include scrollbar;
}

.validators-map__map-wrap {
  position: relative;
}

.validators-map__map-img {
  object-fit: contain;
  min-width: 135.2rem;
  min-height: 52.2rem;
  width: 100%;
  pointer-events: none;
}
</style>
