/**
 * Tries to resolve one Promise after another and
 * returns a Promise with the first resolved result.
 *
 * @param {Array.<Promise>} promises
 * @returns {Promise}
 */
export function promiseFirst(promises) {
  function tryResolve([x, ...xs], resolve, reject) {
    if (xs.length > 0)
      x.then(resolve).catch(_ => tryResolve(xs, resolve, reject))
    else
      x.then(resolve).catch(reject)
  }

  return new Promise((resolve, reject) =>
    tryResolve(promises, resolve, reject)
  )
}

/**
 * Takes an array of values, a promise-returning function and an initial value.
 * Works like reduce, but is aware of async function. Returns a promise that
 * will be resolved with the final aggregator.
 *
 * @param array
 * @param fn Function to execute per value: fn(aggregator, item, index, array)
 * @param initialValue
 * @returns {*} Promise that is resolved when all values are processed
 */
export function promiseReduce(array, fn, initialValue) {
  function reduce(aggregator, index, array, resolve, reject) {
    if (index >= array.length) {
      return resolve(aggregator)
    }
    return fn(aggregator, array[index], index, array).then(newAgg => reduce(newAgg, index + 1, array, resolve, reject))
                                                     .catch(reject)
  }

  return new Promise((resolve, reject) => reduce(initialValue, 0, array, resolve, reject))
}

/**
 * Joins to parts of a URL.
 *
 * @param {string} root - http(s)://domain
 * @param {string} path - /some/path
 * @returns {string} - http(s)://domain/some/path
 */
export function joinURL(root, path) {
  return `${root.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/**
 * Safely gets a nested property from an object, returning
 * a default value if the provided path does not exist.
 * This is to avoid accessing undefined properties along
 * the way e.g. when calling something like `foo.bar.baz[0].quux`.
 *
 * @param obj The object to get nested properties from
 * @param path The path of properties, will be converted to an Array if it's not already
 * @param returnDefault The default value to return if the path does not exist
 * @returns {*}
 */
export function getIn(obj, path, returnDefault = null) {
  if (!obj || typeof path === 'undefined') {
    return returnDefault
  }
  if (!Array.isArray(path)) {
    path = [path]
  }
  const [head, ...tail] = path
  if (obj.hasOwnProperty(head)) {
    return tail.length === 0 ?
      obj[head] :
      getIn(obj[head], tail, returnDefault)
  }
  return returnDefault
}

/**
 * Returns a new set that is the difference of the two sets provided (set1 - set2).
 *
 * @param set1
 * @param set2
 * @returns {Set} set1 - set2
 */
export function setDifference(set1, set2) {
  if (!set1 || set1.size === 0) {
    return new Set()
  }
  if (!set2 || set2.size === 0) {
    return set1
  }
  return new Set([...set1].filter(item => !set2.has(item)))
}
