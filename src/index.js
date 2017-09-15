const objectPath = require('object-path');

// Our valid path validator.
const VALIDATOR = /^((("[^"]*")|('[^']*')|([\w\.]+))\s*\+\s)*(("[^"]*")|('[^']*')|([\w\.]+))$/;

/**
 * `validate` determines if the given path is valid.
 *
 * @param {string} path The path to check the validity of.
 * @returns {boolean} True if the path is valid, false otherwise.
 */
function validate(path) {
  return VALIDATOR.test(path);
}

/**
 * Determines if the provided value is a string or not.
 *
 * @param {*} str The value to check.
 * @returns {boolean} True if `str` is a string, false otherwise.
 */
function isString(str) {
  return str.constructor === String;
}

const STRING_LITERAL = /^['"].+['"]$/;

/**
 * Determines if we believe the provided value to be a "string literal".
 *
 * @param {*} str The value to check.
 * @returns {boolean} True if value is a string beginnined and ending with '"',
 *   false otherwise.
 */
function isStringLiteral(str) {
  return isString(str) && STRING_LITERAL.test(str);
}

/**
 * Blindly tries to remove the first and last characters of the provided value.
 *
 * @param {string} str The value that we'r going to remove the first and last
 *   characters of.
 * @returns {string} The trimmed string.
 */
function trimQuotes(str) {
  if (!isStringLiteral(str)) return str;

  return str.substr(1, str.length - 2);
}

/**
 * Resolves the provided object-path for the given object.
 *
 * @param {Object} obj The object to pull values from.
 * @param {string} path The path to resolve via the given object.
 * @returns {*} The resolved value.
 */
function resolve(obj, path) {
  let val;

  const pieces = path.split('+').map((piece) => piece.trim());
  for (const piece of pieces) {
    let resolved;
    if (isStringLiteral(piece)) {
      resolved = trimQuotes(piece);
    } else {
      resolved = objectPath.get(obj, piece);
    }

    if (val === undefined) {
      val = resolved;
    } else {
      val += resolved;
    }
  }

  return val;
}



module.exports = {
  resolve,
  validate
};
