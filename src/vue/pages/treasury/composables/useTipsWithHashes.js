import { computed } from 'vue'
import { useCall } from '@/vue/composables'
import { useTipHashes } from '@treasury-page/composables/useTipHashes'
import { api } from '@api'

export function useTipsWithHashes () {
  const tipHashes = useTipHashes()
  const tipsWithHashes = useCall(
    (api.query.tips || api.query.treasury).tips.multi,
    computed(() => ([tipHashes.value])),
    { withParams: true },
  )

  const unwrapTipsWithHashes = computed(() => {
    if (!tipHashes.value || !tipsWithHashes.value) return
    const { params: [hashes], ev: optTips } = tipsWithHashes.value
    return optTips
      .reduce((acc, opt, index) => {
        const unwrapOpt = opt.unwrapOr(null)
        const hash = hashes[index]

        if (unwrapOpt && tipHashes.value.includes(hash)) {
          acc.push({ tip: unwrapOpt, hash })
        }
        return acc
      }, [])
      .sort((a, b) =>
        a.tip.closes.isNone
          ? b.tip.closes.isNone
            ? 0
            : -1
          : b.tip.closes.isSome
            ? b.tip.closes.unwrap().cmp(a[1].closes.unwrap())
            : 1,
      )
  })

  return unwrapTipsWithHashes
}
