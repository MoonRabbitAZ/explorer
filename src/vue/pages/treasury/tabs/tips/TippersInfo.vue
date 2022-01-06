<template>
  <div class="tippers-info">
    <div class="tippers-info__body">
      <value-displayer
        v-if="median"
        class="tippers-info__value-displayer"
        :header="$t('treasury-page.tippers-info.median-header')"
        :value="$fbalance(median)"
        :value-level="1"
        :tooltip="$fFullBalance(median)"
      />

      <value-displayer
        class="tippers-info__value-displayer"
        :header="$t('treasury-page.tippers-info.reason-header')"
        :value="reasonText"
        :value-level="4"
        is-full-value
      />
    </div>

    <expander
      class="tippers-info__expander"
      :title="$t('treasury-page.tippers-info.tippers-expander-header', {
        count: tip.tips.length
      })"
      is-in-drawer
    >
      <template #secondary>
        <div class="tippers-info__tippers">
          <template
            v-for="([accountId, balance]) in tip.tips"
            :key="accountId.toString()"
          >
            <account-address
              :account-address="accountId.toString()"
            />
            <p v-tooltip="$fFullBalance(balance)">
              {{ $fbalance(balance) }}
            </p>
          </template>
        </div>
      </template>
    </expander>
  </div>
</template>

<script>
import ValueDisplayer from '@/vue/common/ValueDisplayer'
import Expander from '@/vue/common/Expander'
import AccountAddress from '@/vue/common/AccountAddress'

import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { api } from '@api'
import { useTipsMedian } from '@treasury-page/composables/useTipsMedian'
import { hexToString } from '@polkadot/util'

export default {
  name: 'tippers-info',

  components: {
    ValueDisplayer,
    Expander,
    AccountAddress,
  },

  props: {
    tip: { type: Object, required: true },
  },

  setup (props) {
    const tips = computed(() => props.tip.tips)
    const median = useTipsMedian(tips)
    const reasonText = useCall(
      (api.query.tips || api.query.treasury).reasons,
      [props.tip.reason],
      {
        transform: (optBytes) =>
          optBytes.isSome
            ? hexToString(optBytes.unwrap().toHex())
            : null,
      },
    )

    return { median, reasonText }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.tippers-info__body {
  padding: 0 $drawer-padding;
}

.tippers-info__value-displayer {
  & + & {
    margin-top: 3rem;
  }
}

.tippers-info__expander {
  margin-top: 4rem;
}

.tippers-info__tippers {
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-content: space-between;

  & > :nth-child(2n) {
    justify-self: flex-end;
  }
}
</style>
