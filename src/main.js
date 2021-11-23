import '@/scss/app.scss'

import App from '@/App.vue'
import router from '@/vue-router'

import AppButton from '@/vue/common/AppButton'

import CONFIG from '@/config'
import VTooltip from 'v-tooltip'
import { store } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { i18n } from '@/i18n'
import { ripple, clickOutside } from '@/vue/directives'
import { createApp, h, getCurrentInstance } from 'vue'
import { useFormatDate, useFormatBalance } from '@/vue/composables'
import { formatNumber } from '@polkadot/util'
import { initApi } from '@api'

const app = createApp({
  setup () {
    const app = getCurrentInstance()
    initApi()

    const {
      formatDate,
      formatDateMY,
      formatDateDMY,
      formatDateDDMY,
      formatDateDMYT,
      formatCalendar,
      formatCalendarInline,
    } = useFormatDate()

    const { toBalance, toExternalBalance } = useFormatBalance()

    app.appContext.config.globalProperties.$fd = formatDate
    app.appContext.config.globalProperties.$fdmy = formatDateMY
    app.appContext.config.globalProperties.$fddmy = formatDateDMY
    app.appContext.config.globalProperties.$fdddmy = formatDateDDMY
    app.appContext.config.globalProperties.$fddmyt = formatDateDMYT
    app.appContext.config.globalProperties.$fcalend = formatCalendar
    app.appContext.config.globalProperties.$fcalendi = formatCalendarInline
    app.appContext.config.globalProperties.$fbalance = toBalance
    app.appContext.config.globalProperties.$fExternalBalance = toExternalBalance
    app.appContext.config.globalProperties.$fnumber = formatNumber
  },
  render: () => h(App),
})

app
  .use(store)
  .use(router)
  .use(i18n)
  .use(VTooltip, {
    offset: [0, 20],
    disposeTimeout: 2000,
    instantMove: true,
    themes: {
      tooltip: {
        html: false,
        delay: {
          show: 100,
        },
      },
    },
  })

app.config.globalProperties.$routes = vueRoutes
app.config.globalProperties.$config = CONFIG

app.directive('ripple', ripple)
app.directive('click-outside', clickOutside)

app.component('AppButton', AppButton)

app.mount('#app')
