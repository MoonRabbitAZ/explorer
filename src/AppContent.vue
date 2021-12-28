<template>
  <div class="app-content">
    <navbar />
    <router-view />
    <app-footer class="app-content__footer"/>
  </div>
</template>

<script>
import Navbar from '@/vue/navigation/Navbar'
import AppFooter from '@/vue/navigation/AppFooter'

export default {
  name: 'app-content',

  components: {
    Navbar,
    AppFooter,
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.app-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  gap: 2rem;
}

.app-content__footer {
  margin-top: auto;
}

</style>
