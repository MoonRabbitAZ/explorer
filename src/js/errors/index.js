import * as runtimeErrors from './runtime-errors'
import * as serverErrors from './server-errors'

const errors = {
  ...runtimeErrors,
  ...serverErrors,
}

export { errors }
