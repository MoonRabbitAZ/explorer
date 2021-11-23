import axios from 'axios'
import middlewares from './middlewares'
import { toCamelCaseDeep } from '@/js/helpers/case-converter'
import isEmpty from 'lodash/isEmpty'

const methods = Object.freeze({
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
})

/**
 * Represents ApiCaller that performs requests to servers
 *
 * @see {@link https://docs.abcd.io}
 * @see {@link /docs/README.md}
 */
export class ApiCaller {
  /**
   * Creates an `ApiCaller` instance
   *
   * @param {object} opts
   * @param {string} opts.baseURL - URL to a Horizon server to use
   */
  constructor (opts = {}) {
    this._axios = axios.create()
    if (opts.baseURL) {
      this.useBaseURL(opts.baseURL)
    }
  }

  withBaseURL (baseURL) {
    const newCaller =
      Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    newCaller.useBaseURL(baseURL)
    return newCaller
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} query - query params. query parameters should not contain
   * no more than 1 level of nesting.
   * @param {boolean} [needSign=false] - set `true` to sign the request, also
   * check for `.getWithSignature()`
   * @returns {Object} - the parsed response.
   */
  get (endpoint, query, needSign = false) {
    return this._call({
      method: methods.GET,
      needSign,
      endpoint,
      query,
      isEmptyBodyAllowed: true,
    })
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   * _Cannot_ sign request. _Does_ not parse the * response
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} query - query params. query parameters should not contain
   * no more than 1 level of nesting.
   * @returns {Object} - the response.
   */
  getRaw (endpoint, query) {
    return this._call({
      method: methods.GET,
      needRaw: true,
      endpoint,
      query,
    })
  }

  /**
   * Makes a `GET` to a target `endpoint` with the provided `query` params.
   * Signs the request. Parses the response in JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} query - query params. query parameters should not contain
   * no more than 1 level of nesting.
   * @returns {Object} - the parsed response.
   */
  getWithSignature (endpoint, query) {
    return this.get(endpoint, query, true)
  }

  /**
   * Makes a `POST` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @param {boolean} [needSign=false] - set `true` to sign the request, also
   * check for `.postWithSignature()`
   * @returns {Object} - the parsed response.
   */
  post (endpoint, data, needSign = false) {
    return this._call({
      method: methods.POST,
      needSign,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `POST` to a target `endpoint` with the provided `data` as body.
   * Signs the request. Parses the response in JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  postWithSignature (endpoint, data) {
    return this.post(endpoint, data, true)
  }

  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @param {boolean} [needSign=false] - set `true` to sign the request, also
   * check for `.patchWithSignature()`
   * @returns {Object} - the parsed response.
   */
  patch (endpoint, data, needSign = false) {
    return this._call({
      method: methods.PATCH,
      needSign,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `PATCH` to a target `endpoint` with the provided `data` as body.
   * Signs the request. Parses the response in JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  patchWithSignature (endpoint, data) {
    return this.patch(endpoint, data, true)
  }

  /**
   * Makes a `PUT` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @param {boolean} [needSign=false] - set `true` to sign the request, also
   * check for `.putWithSignature()`
   * @returns {Object} - the parsed response.
   */
  put (endpoint, data, needSign = false) {
    return this._call({
      method: methods.PUT,
      needSign,
      endpoint,
      data,
    })
  }

  /**
   * Makes a `PUT` to a target `endpoint` with the provided `data` as body.
   * Signs the request. Parses the response in JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  putWithSignature (endpoint, data) {
    return this.put(endpoint, data, true)
  }

  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `data` as body.
   * Signing can be enabled with `needSign` argument. Parses the response in
   * JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @param {boolean} [needSign=false] - set `true` to sign the request, also
   * check for `.deleteWithSignature()`
   * @returns {Object} - the parsed response.
   */
  delete (endpoint, data, needSign = false) {
    return this._call({
      method: methods.DELETE,
      needSign,
      endpoint,
      data,
      isEmptyBodyAllowed: true,
    })
  }

  /**
   * Makes a `DELETE` to a target `endpoint` with the provided `data` as body.
   * Signs the request. Parses the response in JsonApi format.
   *
   * @param {string} endpoint - target endpoint _with_ starting slash
   * @param {object} data - body to include
   * @returns {Object} - the parsed response.
   */
  deleteWithSignature (endpoint, data) {
    return this.delete(endpoint, data, true)
  }

  /* eslint-disable */
  /**
   * Performs a request
   *
   * @param {object} opts
   * @param {string} opts.endpoint - endpoint where to make the call to, e.g. `/accounts`
   * @param {object} opts.data - request data (for POST/PUT requests)
   * @param {object} opts.query - request query params. See {@link parseQuery} for details
   * @param {string} opts.method - the http method of request
   * @param {bool} opts.needSign - defines if will try to sign the request, `false` by default
   * @param {bool} opts.needRaw - defines if raw response should be returned, `false` by default
   * @param {bool} opts.isEmptyBodyAllowed - defines if empty body is allowed, `false` by default
   *
   * @private
   */
  /* eslint-enable */
  async _call (opts) {
    let config = {
      baseURL: this._baseURL,
      params: opts.query || {},
      paramsSerializer: function (params) {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      },
      data: (opts.isEmptyBodyAllowed && !opts.data)
        ? undefined
        : opts.data || {},
      method: opts.method,
      url: opts.endpoint,
    }

    config = middlewares.flattenToAxiosJsonApiQuery(config)

    let response

    try {
      response = await this._axios(config)
    } catch (e) {
      throw middlewares.parseJsonapiError(e, this._axios)
    }

    if (!opts.needRaw) {
      response = middlewares.parseJsonapiResponse(response)

      if (!isEmpty(response.links)) {
        if (opts.needSign) {
          response.makeLinkCallersWithSignature(this)
        } else {
          response.makeLinkCallers(this)
        }
      }
    } else {
      response = toCamelCaseDeep(response)
    }

    return response
  }

  /**
   * Assigns new baseURL to the current instance.
   *
   * @param {string} baseURL - URL to horizon server
   */
  useBaseURL (baseURL) {
    this._baseURL = baseURL
  }
}
