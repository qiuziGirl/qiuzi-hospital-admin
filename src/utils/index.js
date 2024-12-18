/**
  * covert a time string to a tiem object
  * @param {string} time
  * @returns {Object}
  * @example
  * // returns { hour: 9, minute: 0 }
  * parseTime('09:00')
  */
export function parseTime (time) {
  const values = String(time).split(':')

  if (values.length >= 2) {
    const hour = Number.parseInt(values[0])
    const minute = Number.parseInt(values[1])

    return {
      hour,
      minute
    }
  }

  return {}
}

/**
 * add time to the basic time
 * @param {Object} time
 * @param {Object} increment
 * @returns {string}
 * @example
 * // returns '10:00'
 * addTime('09:00', '01:00')
 */
export function addTime (time, increment) {
  const oldTime = parseTime(time)
  const increseTime = parseTime(increment)

  const newTime = {
    hour: oldTime.hour,
    minute: oldTime.minute
  }

  newTime.hour += increseTime.hour
  newTime.minute += increseTime.minute

  newTime.hour += Math.floor(newTime.minute / 60)
  newTime.minute = newTime.minute % 60

  return String(newTime.hour).padStart(2, '0') + ':' + String(newTime.minute).padStart(2, '0')
}

/**
 * @description 对字符串进行 SHA-256 哈希加密
 * @param {string} value 被加密字符串
 * @returns {string}
 */
export async function generateHashString (value) {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(item => item.toString(16).padStart(2, '0')).join('')
  return hashHex
}
