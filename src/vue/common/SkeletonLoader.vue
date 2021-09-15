<template>
  <div
    class="sceleton-loader"
    :class="{'sceleton-loader--without-bg': withoutBackground}"
  />
</template>

<script>

export default {
  name: 'sceleton-loader',

  props: {
    withoutBackground: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.sceleton-loader {
  position: relative;
  background-color: $col-app-content-block-bg;
  overflow: hidden;
  border-radius: 0.4rem;

  &--without-bg {
    background-color: transparent;
  }

  &:after {
    content: '';
    width: 45%;
    height: 100%;
    position: absolute;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($col-app-accent, 0.1),
      transparent
    );
    left: 0;
    top: 0;
    animation: skeleton-loader__gradient-animation 0.8s linear infinite;
  }
}

@keyframes skeleton-loader__gradient-animation {
  from {
    left: -50%;
  }

  to {
    left: 100%;
  }
}

</style>
