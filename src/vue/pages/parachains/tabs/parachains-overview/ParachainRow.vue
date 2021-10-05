<template>
  <div class="parachain-row">
    <p class=".parachain-row__main-col parachain-row__id">
      {{ $fnumber(parachainId) }}
    </p>
    <div>
      <!--  -->
    </div>
    <div>
      <app-button
        mdi-icon-name="mdi-chevron-right"
        scheme="secondary"
        @click="clickButtonInfo"
      />
    </div>
  </div>
</template>

<script>
const EVENTS = { clickButtonInfo: 'click-button-info' }

export default {
  name: 'parachain-row',

  props: {
    parachainId: { type: String, required: true },
  },

  emits: Object.values(EVENTS),

  setup (props, { emit }) {
    function clickButtonInfo () {
      emit(EVENTS.clickButtonInfo, props.parachainId)
    }

    return { clickButtonInfo }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachain-row {
  flex: 1;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 7rem 1fr min-content;
  align-items: center;
  padding: 1rem 1.6rem;
  min-height: 4.6rem;

  @include content-block;
}

.parachain-row__id {
  font-size: 1.6rem;
}

.parachain-row__main-col {
  overflow: hidden;
  text-overflow: ellipsis;
}

.parachain-row__dropdown {
  margin-top: 1rem;
}
</style>
