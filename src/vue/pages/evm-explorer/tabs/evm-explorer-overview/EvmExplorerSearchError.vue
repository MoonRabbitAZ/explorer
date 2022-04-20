<template>
  <div class="evm-explorer-search-error">
    <h1>
      {{ $t('evm-explorer-page.evm-explorer-search-error.header') }}
    </h1>
    <p class="evm-explorer-search-error__message">
      {{ $t('evm-explorer-page.evm-explorer-search-error.message') }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'evm-explorer-search-error',
}
</script>

<style lang="scss" scoped>
.evm-explorer-search-error {
  margin: 6rem auto 0;
  max-width: 33.5rem;
  text-align: center;
}

.evm-explorer-search-error__message {
  margin-top: 2rem;
  font-size: 1.4rem;
}
</style>
