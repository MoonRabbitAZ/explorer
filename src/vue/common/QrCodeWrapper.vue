<template>
  <div class="qr-code-wrapper">
    <qr-code
      :value="value"
      :size="size"
      :background="background"
      :foreground="foreground"
      :class-name="className"
      :level="level"
    />
  </div>
</template>

<script>
import QrCode from 'qrcode.vue'

export default {
  name: 'qr-code-wrapper',
  components: {
    QrCode,
  },
  props: {
    value: { type: String, default: '' },
    size: { type: Number, default: 200 },
    background: { type: String, default: '#fff' },
    foreground: { type: String, default: '#262626' },
    className: { type: String, default: '' },
    level: { type: String, default: 'L' },
  },
}
</script>

<style lang="scss" scoped>
$col-qr-code-border: #ffffff;

.qr-code-wrapper {
  border: 1rem solid $col-qr-code-border;
  width: max-content;
}
</style>
