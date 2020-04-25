const Obj = {
  has: require('lodash/has'),

  get: require('lodash/get'),

  set: require('lodash/set'),

  getOrSet(target, key, value) {
    const exists = Obj.has(target, key)

    if (exists) {
      return Obj.get(target, key)
    }

    Obj.set(target, key, value)

    return value
  },
}

module.exports = Obj
