module.exports = {
  has: require('lodash/has'),

  get: require('lodash/get'),

  set: require('lodash/set'),

  getOrSet(target, key, value) {
    const exists = this.has(target, key)

    if (exists) {
      return this.get(target, key)
    }

    this.set(target, key, value)

    return value
  },
}
