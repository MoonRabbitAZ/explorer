<template>
  <div class="parachain-row app__content-block">
    <button
      type="button"
      class="parachain-row__row-button"
      @click="isDropdownOpened = !isDropdownOpened"
    >
      <div class="parachain-row__main">
        <p class="parachain-row__main-col">
          {{ $fnumber(parachainId) }}
        </p>
        <p class="parachain-row__main-col">
          <template v-if="heads">
            {{ cropString(heads.toString(), 6) }}
          </template>
        </p>
        <p class="parachain-row__main-col">
          <template v-if="paraLifecycles">
            {{ paraLifecycles.toString() }}
          </template>
        </p>
        <p class="parachain-row__main-col">
          <template v-if="parachainPeriod">
            {{ parachainPeriod }}
          </template>
        </p>
        <p class="parachain-row__main-col">
          <template v-if="endDate">
            {{ endDate }}
          </template>
        </p>
      </div>
      <i
        class="mdi mdi-chevron-down parachain-row__chevron-icon"
        :class="{'parachain-row__chevron-icon--opened': isDropdownOpened}"
      />
    </button>

    <template v-if="isDropdownOpened">
      <parachain-row-dropdown
        class="parachain-row__dropdown"
        :is-shown="isDropdownOpened"
        :parachain-id="parachainId"
        :last-blocks="lastBlocks"
      />
    </template>
  </div>
</template>

<script>
import ParachainRowDropdown from '@parachains-page/tabs/parachains-overview/ParachainRowDropdown'

import { computed, ref } from 'vue'
import { api } from '@api'
import { useCall, useBlockTime } from '@/vue/composables'
import { cropString } from '@/js/helpers/crop-string'
import BN from 'bn.js'

export default {
  name: 'parachain-row',

  components: {
    ParachainRowDropdown,
  },

  props: {
    parachainId: { type: String, required: true },
    lastBlocks: { type: Object, default: null },
    leasePeriod: {
      type: Object,
      default: null,
    },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const isDropdownOpened = ref(false)

    const heads = useCall(api.query.paras.heads, [props.parachainId])
    const leases = useCall(api.query.slots.leases, [props.parachainId])
    const paraLifecycles =
      useCall(api.query.paras.paraLifecycles, [props.parachainId])

    const leasesPeriods = computed(() => {
      if (!leases.value) return
      return leases.value.map((opt, index) => opt.isSome ? index : -1)
        .filter((period) => period !== -1)
    })

    const parachainPeriod = computed(() => {
      if (!props.leasePeriod || !leasesPeriods.value?.length) return ''
      const startBn = props.leasePeriod.currentPeriod
        .addn(leasesPeriods.value[0])
      const endBn = props.leasePeriod.currentPeriod
        .addn(leasesPeriods.value[leasesPeriods.value.length - 1])

      return startBn.eq(endBn)
        ? startBn.toString()
        : `${startBn.toString()}-${endBn.toString()}`
    })

    const endDate = computed(() => {
      if (!parachainPeriod.value || !leasesPeriods.value) return

      const periodsBn = new BN(
        leasesPeriods.value[leasesPeriods.value.length - 1])
        .imul(props.leasePeriod.length)
        .iadd(props.leasePeriod.remainder)
      return calculateTimeStr(periodsBn, true)
    })

    return {
      heads,
      paraLifecycles,
      parachainPeriod,
      leases,
      cropString,
      endDate,
      length,
      isDropdownOpened,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachain-row {
  padding: 1rem 1.6rem;
  min-height: 4.6rem;
}

.parachain-row__row-button {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  gap: 2rem;
}

.parachain-row__main {
  flex: 1;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 7rem repeat(2, 1fr) 10rem 12rem;
  align-items: center;
}

.parachain-row__chevron-icon {
  font-size: 2rem;
  transition: all 0.1s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.parachain-row__main-col {
  overflow: hidden;
  text-overflow: ellipsis;
}

.parachain-row__dropdown {
  margin-top: 1rem;
}
</style>
