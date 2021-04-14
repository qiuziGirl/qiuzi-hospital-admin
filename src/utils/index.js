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
