<template>
  <router-link
    class="logo"
    :to="$routes.app"
  >
    <img
      lass="logo__img"
      src="@static/branding/logo.png"
      :alt="$t('logo')"
    >
  </router-link>
</template>

<script>
export default {
  name: 'logo',
}
</script>

<style lang="scss">
@import '~@scss/variables';

.logo {
  display: block;
  width: $logo-size;
  height: $logo-size;
}

.logo__img {
  width: 100%;
  height: 100%;
}

</style>

<i18n>
{
  "en": {
    "logo": "Logo",
  }
}
</i18n>
