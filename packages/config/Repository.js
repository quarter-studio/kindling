const get = require('lodash/get')
const has = require('lodash/has')
const set = require('lodash/set')

class Repository {
  constructor(value = {}) {
    this.value = value
  }

  get(key, fallback) {
    return get(this.value, key, fallback)
  }

  has(key) {
    return has(this.value, key)
  }

  set(key, value) {
    return set(this.value, key, value)
  }
}

module.exports = Repository
