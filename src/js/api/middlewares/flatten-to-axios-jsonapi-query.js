import _ from 'lodash'

/* eslint-disable */
/**
 * @param {object} requestConfig - axios request config with the raw, not formatted `params` object
 * @return {object} resultQuery - the formatted query object that is valid to use
 * in http-clients
 */
/* eslint-enable */

export function flattenToAxiosJsonApiQuery (requestConfig) {
  const config = _.cloneDeep(requestConfig)

  if (isDeeperThanOneNesting(config.params)) {
    throw new Error('Nested arrays or objects are not allowed for using in query params')
  }

  config.params = {
    ...flattenArraysOnly(config.params),
    ...flattenObjectsOnly(config.params),
    ...flattenPrimitivesOnly(config.params),
  }

  return config
}

function isDeeperThanOneNesting (object) {
  return Object.values(object)
    .filter((value) => isObjectOrArray(value))
    .reduce((acc, cur) => acc.concat(Object.values(cur)), [])
    .some((value) => isObjectOrArray(value))
}

function isObjectOrArray (arg) {
  return arg instanceof Object
}

function isObject (arg) {
  return !Array.isArray(arg) && arg instanceof Object
}

function flattenArraysOnly (object) {
  return Object.entries(object)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => [key, value.join(',')])
    .reduce((res, [key, val]) => ({ ...res, ...{ [key]: val } }), {})
}

function flattenObjectsOnly (object) {
  return Object.entries(object)
    .filter(([, value]) => isObject(value))
    .map(([prefix, nestedObj]) => Object.entries(nestedObj)
      .map(([key, value]) => [`${prefix}[${key}]`, value]),
    )
    .reduce((acc, row) => acc.concat(row), [])
    .reduce((res, [key, val]) => ({ ...res, ...{ [key]: val } }), {})
}

function flattenPrimitivesOnly (object) {
  return Object.entries(object)
    .filter(([, value]) => !isObjectOrArray(value))
    .reduce((res, [key, val]) => ({ ...res, ...{ [key]: val } }), {})
}
