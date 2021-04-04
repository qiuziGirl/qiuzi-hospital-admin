/**
 * delete query parameter when value is null or undefined
 * @param {Object} params
 * @returns {Object}
 */
export function deleteEmptyParam (params) {
  const tempParams = Object.assign({}, params)

  for (const key in tempParams) {
    if (params[key] === null || typeof params[key] === 'undefined') {
      delete tempParams[key]
    }
  }

  return tempParams
}
