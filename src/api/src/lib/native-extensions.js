String.prototype.toBoolean = function () {
  return this.toLowerCase().trim() === 'true'
}

/**
 * A helper function for sanitizing SQL strings
 * to assist for building dynamic SQL
 *
 * @param {String} value
 * @returns String
 */
global.sanitizeSqlValue = value => {
  if (typeof value === 'string') {
    return value.replaceAll("'", "''")
  }

  return value
}

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr)
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr)
  }
}
