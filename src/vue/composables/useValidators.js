import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import { isHex } from '@polkadot/util'
import { unref, isRef } from 'vue'
import { mnemonicValidate } from '@polkadot/util-crypto'
import { useFormatBalance } from '@/vue/composables'

import BN from 'bn.js'
import { useI18n } from 'vue-i18n'

// TODO: fix retranslating error message after change localization language

function extractValue (val) {
  return val.value
    ? isRef(val)
      ? unref(val)
      : val.value
    : val
}

export function useValidators () {
  const { t } = useI18n()
  const { toBalance } = useFormatBalance()

  const required = value => {
    let isRequired
    if (Array.isArray(value)) {
      isRequired = !!value.length
    } else if (typeof value === 'object' && value !== null) {
      isRequired = !isEmpty(value)
    } else {
      isRequired = !!value
    }

    return isRequired ? '' : t('validation.field-error_required')
  }

  const minLength = min => value => `${value}`.length >= min
    ? ''
    : t('validation.field-error_minLength', { minLength: min })

  const maxLength = max => value => `${value}`.length <= max
    ? ''
    : t('validation.field-error_maxLength', { maxLength: max })

  const alphaNum = val => /^[a-z0-9]+$/i.test(val)
    ? ''
    : t('validation.field-error_alphaNum')

  const alpha = val => /^[a-zA-Z]+$/i.test(val)
    ? ''
    : t('validation.field-error_alpha')

  const birthday = val => moment(val, 'YYYY-MM-DD', true).isValid()
    ? ''
    : t('validation.field-error_birthday')

  const email = val => {
    // eslint-disable-next-line no-control-regex
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    return regex.test(val)
      ? ''
      : t('validation.field-error_email')
  }

  const blockIdent = val => {
    return isHex(val, 256) || /^$|[0-9]+$/i.test(val)
      ? ''
      : t('validation.field-error_blockIdent')
  }

  const password = val => {
    return minLength(6)(val)
      ? t('validation.field-error_password')
      : ''
  }

  const sameAsPassword = val1 => {
    return (val2) => {
      return extractValue(val1) === val2
        ? ''
        : t('validation.field-error_sameAsPassword')
    }
  }

  const mnemonicSed = val => {
    return mnemonicValidate(val)
      ? ''
      : t('validation.field-error_mnemonicSed')
  }

  const hexSeed = val => {
    const seedLength = 66

    return isHex(val) && val.length === seedLength
      ? ''
      : t('validation.field-error_hexSeed', { length: seedLength })
  }

  const amountRange = (minValue, maxValue) => {
    return (val) => {
      const extractMinValue = extractValue(minValue)
      const extractMaxValue = extractValue(maxValue)
      const bnMinValue = BN.isBN(extractMinValue)
        ? extractMinValue
        : new BN(extractMinValue)
      const bnMaxValue = BN.isBN(extractMaxValue)
        ? extractMaxValue
        : new BN(extractMaxValue)
      const bnValue = BN.isBN(val) ? val : new BN(val)

      return bnMinValue.lte(bnValue) && bnValue.lte(bnMaxValue)
        ? ''
        : t('validation.field-error_amountRange', {
          from: toBalance(bnMinValue),
          to: toBalance(bnMaxValue),
        })
    }
  }

  return {
    required,
    minLength,
    maxLength,
    alphaNum,
    alpha,
    birthday,
    email,
    blockIdent,
    password,
    sameAsPassword,
    mnemonicSed,
    hexSeed,
    amountRange,
  }
}
