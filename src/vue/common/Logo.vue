<template>
  <router-link
    class="logo"
    :to="$routes.app"
  >
    <img
      class="logo__img"
      src="@static/branding/logo.png"
      :alt="$t('common.logo.logo')"
    >
    <img
      class="logo__img-name"
      src="@static/branding/logo-name.svg"
      :alt="$t('common.logo.logo')"
    >
  </router-link>
</template>

<script>
export default { name: 'logo' }
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.logo {
  display: flex;
  align-items: center;
  width: max-content;
  height: max-content;
}

.logo__img {
  width: $logo-size;
  height: $logo-size;
}

.logo__img-name {
  display: none;
  width: $logo-name-width;
  height: $logo-name-height;
  margin-left: 1.6rem;

  @include respond-to($sidebar-hide-bp) {
    display: block;
  }
}

</style>
