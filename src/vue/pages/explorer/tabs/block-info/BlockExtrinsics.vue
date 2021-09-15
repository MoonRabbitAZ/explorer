<template>
  <div class="block-extrinsics">
    <div class="block-extrinsics__wrap">
      <div class="block-extrinsics__body-titles">
        <h1 class="block-extrinsics__main-title">
          {{ $t('extrinsics-title') }}
        </h1>
        <h2 class="block-extrinsics__secondary-title">
          {{ $t('events-title') }}
        </h2>
        <h2 class="block-extrinsics__secondary-title">
          {{ $t('weight-title') }}
        </h2>
        <h2 class="block-extrinsics__secondary-title">
          {{ $t('signatory-title') }}
        </h2>
      </div>
      <template v-if="extrinsics.length">
        <div class="block-extrinsics__body  app__content-block">
          <extrinsic-row
            v-for="(extr, index) in extrinsics"
            :key="index"
            class="block-extrinsics__extrinsic-item"
            :extrinsic="extr"
            :index="index"
            :events="events"
            :block-number="blockNumber"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message
          is-secondary
          :message="$t('no-data-message')"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ExtrinsicRow from '@explorer-page/tabs/block-info/ExtrinsicRow'
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'block-extrinsics',

  components: {
    ExtrinsicRow,
    NoDataMessage,
  },

  props: {
    blockNumber: { type: Number, required: true },
    events: { type: Array, required: true },
    extrinsics: { type: Array, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.block-extrinsics {
  max-width: 100%;
  overflow-x: auto;

  @include scrollbar;
}

.block-extrinsics__wrap {
  min-width: 89rem;
}

.block-extrinsics__extrinsic-item {
  padding: 1.6rem 0;

  & + & {
    border-top: 0.1rem solid $col-block-extrinsics-border;
  }
}

.block-extrinsics__main-title {
  font-size: 2rem;
  font-weight: 400;
}

.block-extrinsics__secondary-title {
  font-size: 1.4rem;
  font-weight: 400;
}

.block-extrinsics__body {
  padding: 1.6rem 2.4rem;
}

.block-extrinsics__body-titles {
  padding: 0 2.4rem 1.6rem;
  display: grid;
  grid-gap: 0 3rem;
  grid-template-columns:
    repeat(2, minmax(25rem, 1fr))
    repeat(2, minmax(12.8rem, 18rem));
  align-items: flex-end;
}
</style>

<i18n>
{
  "en": {
    "extrinsics-title": "Extrinsics",
    "events-title": "Events",
    "weight-title": "Weight",
    "signatory-title": "Signatory",
    "no-data-message": "No extrinsics available"
  }
}
</i18n>
