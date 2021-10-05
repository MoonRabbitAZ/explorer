import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { keyring } from '@polkadot/ui-keyring'

export function useCryptoType (accountAddress) {
  const { t } = useI18n()
  const cryptoType = ref(t('crypto-types.unknown'))

  try {
    const current = accountAddress
      ? keyring.getPair(accountAddress)
      : null

    if (current) {
      switch (true) {
        case current.meta.isInjected:
          cryptoType.value = t('crypto-types.injected')
          break
        case current.meta.isHardware:
          cryptoType.value = current.meta.hardwareType || t('crypto-types.hardware')
          break
        case current.meta.isExternal:
          cryptoType.value = current.meta.isMultisig
            ? t('crypto-types.multisig')
            : current.meta.isProxied
              ? t('crypto-types.proxied')
              : t('crypto-types.external')
          break
        default:
          cryptoType.value = current.type
      }
    }
  } catch (error) {
    // cannot determine, keep unknown
  }

  return {
    cryptoType,
  }
}
