import { watch, reactive, unref, isRef } from 'vue'

export function useField (field) {
  const fieldState = reactive({
    isValid: false,
    value: field.value,
    touched: false,
    errorMessage: '',
    blur: null,
  })

  const validators = field.validators

  const setFieldErrorMessage = (message = '') => {
    if (fieldState.touched) { fieldState.errorMessage = message }
  }

  const reAssign = val => {
    fieldState.isValid = true
    setFieldErrorMessage()
    const validators = unref(field.validators)
    Object.keys(validators ?? {}).forEach(key => {
      if (!validators[key]) return
      const validatorErrorMessage = validators[key](val)

      if (validatorErrorMessage) {
        fieldState.isValid = false
        setFieldErrorMessage(validatorErrorMessage)
      }
    })
  }

  fieldState.blur = () => {
    fieldState.touched = true
    if (!fieldState.isValid) reAssign(fieldState.value)
  }

  watch(() => fieldState.value, reAssign)

  // if dynamic validators
  if (isRef(validators)) watch(validators, () => reAssign(fieldState.value))

  reAssign(fieldState.value)

  return fieldState
}
