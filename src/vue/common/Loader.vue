<template>
  <div class="loader">
    <lottie-animation
      path="static/branding/loader.json"
      :auto-play="true"
      :speed="2"
      :width="100"
      :height="100"
    />
  </div>
</template>

<script>
import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue'

export default {
  name: 'loader',

  components: {
    LottieAnimation,
  },
}
</script>
