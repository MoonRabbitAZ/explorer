<template>
  <div class="motions-voters">
    <!--  -->
  </div>
</template>

<script>

export default {
  name: 'motions-list',

  components: {

  },

  props: {

  },

  setup () {
    //
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.motions-list__header {
  padding: 0 1.6rem;
  margin-bottom: 2rem;
}

.motions-list__row {
  & + & {
    margin-top: 0.4rem;
  }
}

</style>
