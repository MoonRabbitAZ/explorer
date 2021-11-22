<template>
  <div class="parachain-info">
    <div class="parachain-info__body">
      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.parachain-id-header')"
        :value="$fnumber(parachainId)"
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.head-header')"
        :value="heads ? cropString(heads.toString(), 14) : null"
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.lifecycle-header')"
        :value="paraLifecycles?.toString()"
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.backed-header')"
        :value="lastBlocks?.backed?.toString()"
        :route="{
              ...$routes.blockInfoTab,
              query: {
                blockIdent: lastBlocks?.backed?.toString(),
              }
        }"
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.included-header')"
        :value="lastBlocks?.included?.toString()"
        :route="{
              ...$routes.blockInfoTab,
              query: {
                blockIdent: lastBlocks?.included?.toString(),
              }
        }"
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.timeout-header')"
        :value="lastBlocks?.timeout?.toString() || '-'"
        :route="lastBlocks?.timeout
          ? {
            ...$routes.blockInfoTab,
            query: {
              blockIdent: lastBlocks?.timeout?.toString(),
            }
          }
          : null
        "
      />

      <value-displayer
        class="parachain-info__value-displayer"
        :header="$t('parachains-page.parachains-info.leases-header')"
        :value="parachainPeriod"
      />
    </div>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'

import { computed, ref } from 'vue'
import { api } from '@api'
import { useCall, useBlockTime } from '@/vue/composables'
import { cropString } from '@/js/helpers/crop-string'
import { LeasePeriodRecord } from '@/js/records/lease-period.record'
import BN from 'bn.js'

export default {
  name: 'parachain-info',

  components: { ValueDisplayer },

  props: {
    parachainId: { type: String, required: true },
    leasePeriod: { type: LeasePeriodRecord, default: null },
    lastBlocks: { type: Object, default: null },
  },

  setup (props) {
    const { calculateTimeStr } = useBlockTime()
    const isDropdownOpened = ref(false)

    const heads = useCall(api.query.paras.heads, [props.parachainId])
    const leases = useCall(api.query.slots.leases, [props.parachainId])
    const paraLifecycles =
      useCall(api.query.paras.paraLifecycles, [props.parachainId])

    const leasesPeriods = computed(() => {
      return leases.value?.reduce((acc, opt, index) => {
        if (opt.isSome) acc.push(index)

        return acc
      }, [])
    })

    const parachainPeriod = computed(() => {
      if (!props.leasePeriod || !leasesPeriods.value?.length) return
      const startBn = props.leasePeriod.currentPeriod
        .addn(leasesPeriods.value[0])
      const endBn = props.leasePeriod.currentPeriod
        .addn(leasesPeriods.value[leasesPeriods.value.length - 1])

      const periodsBn = new BN(
        leasesPeriods.value[leasesPeriods.value.length - 1])
        .imul(props.leasePeriod.length)
        .iadd(props.leasePeriod.remainder)
      const endDate = calculateTimeStr(periodsBn, true)

      return startBn.eq(endBn)
        ? `(${startBn.toString()}) ${endDate}`
        : `(${startBn.toString()}-${endBn.toString()}) ${endDate}`
    })

    return {
      heads,
      paraLifecycles,
      parachainPeriod,
      leases,
      cropString,
      length,
      isDropdownOpened,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachain-info__body {
  padding: 0 $drawer-padding;
}

.parachain-info__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

</style>
