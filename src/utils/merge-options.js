import isOptionObject from 'is-plain-obj'

const { hasOwnProperty } = Object.prototype
const { propertyIsEnumerable } = Object
/**
 * @param {*} object
 * @param {string | symbol | number} name
 * @param {any} value
 */
const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
  value,
  writable: true,
  enumerable: true,
  configurable: true
})

const globalThis = this
const defaultMergeOptions = {
  concatArrays: false,
  ignoreUndefined: false
}

/**
 * @param {*} value
 * @returns {Array<string | symbol>}
 */
const getEnumerableOwnPropertyKeys = value => {
  /** @type {Array<string | symbol>} */
  const keys = []

  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      keys.push(key)
    }
  }

  /* istanbul ignore else  */
  if (Object.getOwnPropertySymbols) {
    const symbols = Object.getOwnPropertySymbols(value)

    for (const symbol of symbols) {
      if (propertyIsEnumerable.call(value, symbol)) {
        keys.push(symbol)
      }
    }
  }

  return keys
}

/**
 * @param {*} value
 */
function clone (value) {
  if (Array.isArray(value)) {
    return cloneArray(value)
  }

  if (isOptionObject(value)) {
    return cloneOptionObject(value)
  }

  return value
}

/**
 * @param {*} array
 */
function cloneArray (array) {
  const result = array.slice(0, 0)

  getEnumerableOwnPropertyKeys(array).forEach(key => {
    defineProperty(result, key, clone(array[key]))
  })

  return result
}

/**
 * @param {*} object
 */
function cloneOptionObject (object) {
  const result = Object.getPrototypeOf(object) === null ? Object.create(null) : {}

  getEnumerableOwnPropertyKeys(object).forEach(key => {
    defineProperty(result, key, clone(object[key]))
  })

  return result
}

/**
 * @param {*} merged - already cloned
 * @param {*} source - something to merge
 * @param {Array<string | symbol>} keys - keys to merge
 * @param {object} config - Config Object
 * @param {boolean} [config.ignoreUndefined] - whether to ignore undefined values
 * @param {boolean} [config.concatArrays] - Config Object
 * @returns {*} cloned Object
 */
const mergeKeys = (merged, source, keys, config) => {
  keys.forEach(key => {
    if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
      return
    }

    // Do not recurse into prototype chain of merged
    if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
      defineProperty(merged, key, merge(merged[key], source[key], config))
    } else {
      defineProperty(merged, key, clone(source[key]))
    }
  })

  return merged
}

/**
 * @param {*} merged - already cloned
 * @param {*} source - something to merge
 * @param {object} config - Config Object
 * @returns {*} cloned Object
 *
 * see [Array.prototype.concat ( ...arguments )](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat)
 */
const concatArrays = (merged, source, config) => {
  let result = merged.slice(0, 0)
  let resultIndex = 0;

  [merged, source].forEach(array => {
    /** @type {Array<string | symbol>} */
    const indices = []

    // `result.concat(array)` with cloning
    for (let k = 0; k < array.length; k++) {
      if (!hasOwnProperty.call(array, k)) {
        continue
      }

      indices.push(String(k))

      if (array === merged) {
        // Already cloned
        defineProperty(result, resultIndex++, array[k])
      } else {
        defineProperty(result, resultIndex++, clone(array[k]))
      }
    }

    // Merge non-index keys
    result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter(key => !indices.includes(key)), config)
  })

  return result
}

/**
 * @param {*} merged - already cloned
 * @param {*} source - something to merge
 * @param {object} config - Config Object
 * @param {boolean} [config.concatArrays] - Config Object
 * @returns {*} cloned Object
 */
function merge (merged, source, config) {
  if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
    return concatArrays(merged, source, config)
  }

  if (!isOptionObject(source) || !isOptionObject(merged)) {
    return clone(source)
  }

  return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config)
}

/**
 * @param  {...any} options
 */
function mergeOptions (...options) {
  // @ts-expect-error this is shadowed by the container
  const config = merge(clone(defaultMergeOptions), (this !== globalThis && this) || {}, defaultMergeOptions)
  let merged = { _: {} }

  for (const option of options) {
    if (option === undefined) {
      continue
    }

    if (!isOptionObject(option)) {
      throw new TypeError('`' + option + '` is not an Option Object')
    }

    merged = merge(merged, { _: option }, config)
  }

  return merged._
}

export default mergeOptions
