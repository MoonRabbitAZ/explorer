import axios from 'axios'

import { toCamelCaseDeep } from '@/js/helpers/case-converter'
import { get } from 'lodash'

/**
 * Base class for server errors.
 */
export class ServerErrorBase extends Error {
  /**
   * Wrap a raw axios error.
   *
   * @param {object} originalError Raw axios response.
   * @param {axios} axiosInstance Axios instance used for request.
   */
  constructor (originalError, axiosInstance) {
    super(originalError.message)

    this.originalError = originalError
    this._axios = axiosInstance || axios.create()
  }

  /**
   * Response HTTP status.
   */
  get httpStatus () {
    return this.originalError.response.status
  }

  /**
   * Error meta.
   */
  get meta () {
    return this._meta
  }

  /**
   * A short, human-readable summary of the problem.
   */
  get title () {
    return this._title
  }

  /**
   * A human-readable explanation specific to this occurrence of the problem.
   */
  get detail () {
    return this._detail
  }

  get requestPath () {
    return this.originalError.response.request.path
  }

  /**
   * Retry the failed request.
   * Use it to retry requests after 2FA.
   */
  retryRequest () {
    const config = this.originalError.config
    return this._axios(config)
  }
}

/**
 * Generic server error response.
 */
export class ServerError extends ServerErrorBase {
  constructor (originalError, axios) {
    super(originalError, axios)

    const unwrappedError = get(originalError, 'response.data.errors[0]', {})
    this._title = unwrappedError.title
    this._detail = unwrappedError.detail
    this._meta = toCamelCaseDeep(unwrappedError.meta || {})
  }
}

/**
 * "Bad Request" error.
 * `error.nestedErrors` may contain per-field errors.
 *
 * @export
 * @class
 */
export class BadRequestError extends ServerError {
  /**
   * Wrap a raw API error response.
   *
   * @constructor
   *
   * @param {Error} originalError Original error response.
   * @param {axios} axios Axios instance used for the request.
   */
  constructor (originalError, axios) {
    super(originalError, axios)
    const errors = get(originalError, 'response.data.errors', [])
    if (errors.length > 1) {
      this._title = 'Request contains some errors.'
      this._detail = 'Request contains some errors. Check "nestedErrors"'
      this._nestedErrors = errors.map(err => ({
        title: err.title,
        detail: err.detail,
        meta: toCamelCaseDeep(err.meta),
      }))
    }
  }

  /**
   * Errors for every invalid field.
   */
  get nestedErrors () {
    return this._nestedErrors
  }
}

/**
 * User is not allowed to perform this action.
 *
 * @export
 * @class
 */
export class NotAllowedError extends ServerError {}

/**
 * Forbidden.
 *
 * @export
 * @class
 */
export class ForbiddenRequestError extends ServerError {}

/**
 * The requested resource was not found.
 *
 * @export
 * @class
 */
export class NotFoundError extends ServerError {}

/**
 * The request could not be completed due to a conflict with the current state
 * of the target resource.
 *
 * @export
 * @class
 */
export class ConflictError extends ServerError {}

/**
 * Internal server error (500)
 *
 * @export
 * @class
 */
export class InternalServerError extends ServerError {}
