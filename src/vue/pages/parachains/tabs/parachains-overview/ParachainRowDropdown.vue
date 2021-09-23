<template>
  <div class="parachain-row-dropdown">
    <div class="parachain-row-dropdown__row">
      <h5 class="parachain-row-dropdown__title">
        {{ $t('backed-title') }}
      </h5>
      <div class="parachain-row-dropdown__value">
        <router-link
          v-if="lastBlocks?.backed"
          class="parachain-row-dropdown__value-link"
          :to="{
              ...$routes.blockInfoTab,
              query: {
                blockIdent: lastBlocks.backed.toString(),
              }
          }"
        >
          {{ lastBlocks.backed.toString() }}
        </router-link>
      </div>
    </div>
    <div class="parachain-row-dropdown__row">
      <h5 class="parachain-row-dropdown__title">
        {{ $t('included-title') }}
      </h5>
      <div class="parachain-row-dropdown__value">
        <div>
          <router-link
            v-if="lastBlocks?.included"
            class="parachain-row-dropdown__value-link"
            :to="{
              ...$routes.blockInfoTab,
              query: {
                blockIdent: lastBlocks.included.toString(),
              }
            }"
          >
            {{ lastBlocks.included.toString() }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="parachain-row-dropdown__row">
      <h5 class="parachain-row-dropdown__title">
        {{ $t('timeout-title') }}
      </h5>
      <div class="parachain-row-dropdown__value">
        <router-link
          v-if="lastBlocks?.timeout"
          class="parachain-row-dropdown__value-link"
          :to="{
              ...$routes.blockInfoTab,
              query: {
                blockIdent: lastBlocks.timeout.toString(),
              }
          }"
        >
          {{ lastBlocks.timeout.toString() }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'parachain-row-dropdown',

  props: {
    parachainId: { type: String, required: true },
    lastBlocks: { type: Object, default: null },
    validators: { type: Object, default: null },
    leasePeriod: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.parachain-row-dropdown {
  overflow: hidden;
}

.parachain-row-dropdown__row {
  display: flex;
  gap: 1rem;

  & + & {
    margin-top: 1rem;
  }
}

.parachain-row-dropdown__title {
  font-size: 1.2rem;
  width: 10rem;
  color: $col-app-header-secondary;
}

.parachain-row-dropdown__value-link {
  color: $col-app-accent;
}

</style>

<i18n>
{
  "en": {
    "backed-title": "Backed:",
    "included-title": "Included:",
    "timeout-title": "Timeout:"
  }
}
</i18n>
