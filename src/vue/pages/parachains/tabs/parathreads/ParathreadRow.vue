<template>
  <div class="parathread-row">
    <p class="parathread-row__column parathread-row__para-id">
      {{ $fnumber(paraId) }}
    </p>
    <div class="parathread-row__column">
      <template v-if="manager">
        <account-address :account-address="manager.toString()"/>
      </template>
      <template v-else>
        <skeleton-loader class="parathread-row__skeleton-loader" />
      </template>
    </div>
    <p class="parathread-row__column">
      <template v-if="headHex">
        {{ headHex }}
      </template>
      <template v-else>
        <skeleton-loader class="parathread-row__skeleton-loader" />
      </template>
    </p>
    <p class="parathread-row__column">
      <template v-if="lifecycle">
        <p>
          {{ lifecycle?.toString() }}
        </p>
      </template>
      <template v-else>
        <skeleton-loader class="parathread-row__skeleton-loader" />
      </template>
    </p>
    <p class="parathread-row__column">
      <template v-if="headHex">
        {{ period }}
      </template>
      <template v-else>
        <skeleton-loader class="parathread-row__skeleton-loader" />
      </template>
    </p>
  </div>
</template>

<script>
import AccountAddress from '@/vue/common/AccountAddress'
import SkeletonLoader from '@/vue/common/SkeletonLoader'

import { computed } from 'vue'
import { api } from '@api'
import { useCall } from '@/vue/composables'
import { cropString } from '@/js/helpers/crop-string'
import { useI18n } from 'vue-i18n'
import { LeasePeriodRecord } from '@/js/records/lease-period.record'

export default {
  name: 'parathread-row',

  components: { AccountAddress, SkeletonLoader },

  props: {
    paraId: { type: String, required: true },
    leases: { type: Array, default: null },
    leasePeriod: { type: LeasePeriodRecord, default: null },
  },

  setup (props) {
    const { t } = useI18n()
    const optInfo = useCall(api.query.registrar.paras, [props.paraId])
    const optHead = useCall(api.query.paras.heads, [props.paraId])
    const lifecycle = useCall(api.query.paras.paraLifecycles, [props.paraId])
    const optGenesis =
      useCall(api.query.paras.upcomingParasGenesis, [props.paraId])

    const manager = computed(() => {
      return optInfo.value?.isSome
        ? optInfo.value.unwrap().manager
        : null
    })

    const headHex = computed(() => {
      if (optHead.value?.isSome) {
        return cropString(optHead.value?.unwrap().toString(), 10)
      } else if (optGenesis.value?.isSome) {
        return cropString(optGenesis.value?.unwrap().genesisHead.toString(), 10)
      } else {
        return null
      }
    })

    const period = computed(() => {
      if (!props.leasePeriod || !props.leases) return
      if (!props.leases.length) return t('parachains-page.parathread-row.leases-none')

      const startBn = props.leasePeriod.currentPeriod
        .addn(props.leases[0])
      const endBn = props.leasePeriod.currentPeriod
        .addn(props.leases[props.leases.length - 1])

      return startBn.eq(endBn)
        ? `${startBn.toString()}`
        : `${startBn.toString()}-${endBn.toString()}`
    })

    return { manager, headHex, period, lifecycle }
  },

}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parathread-row {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 8rem minmax(12rem, 1fr) 15rem 15rem 10rem;
  align-items: center;
  padding: 1rem 1.6rem;

  @include content-block;
}

.parathread-row__column {
  overflow: hidden;
  text-overflow: ellipsis;
}

.parathread-row__para-id {
  font-size: 1.6rem;
  color: $col-app-accent;
}

.parathread-row__skeleton-loader {
  height: 2rem;
}
</style>
