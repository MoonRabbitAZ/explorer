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
        <p
          v-if="heads"
          class="parachain-row__main-col"
        >
          {{ cropString(heads.toString(), 6) }}
        </p>
        <p
          class="parachain-row__main-col"
          v-if="paraLifecycles">
          {{ paraLifecycles.toString() }}
        </p>
        <p
          class="parachain-row__main-col"
          v-if="parachainPeriod">
          {{ parachainPeriod }}
        </p>
        <p
          class="parachain-row__main-col"
        >
          {{ endDate }}
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
import { useCall } from '@/vue/composables'
import { cropString } from '@/js/helpers/crop-string'

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
    const isDropdownOpened = ref(false)
    const endDate = ref('359 days 15 hrs')

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

    // watchEffect(() => {
    //   if (!parachainPeriod.value || !leasesPeriods.value) return

    //   const periodsBn = new BN(
    //     leasesPeriods.value[leasesPeriods.value.length - 1])
    //     .imul(props.leasePeriod.length)
    //     .iadd(props.leasePeriod.remainder)
    //   const blockTime = useBlockTime(periodsBn, true)
    //   endDate.value = blockTime.timeStr.value
    // })

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
  grid-template-columns: 7rem repeat(2, 1fr) 12rem;
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
