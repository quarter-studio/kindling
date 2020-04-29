module.exports = Base => {
  return class extends Base {
    macro(name, args = []) {
      const resolve = require('lodash/' + name)
      const value = resolve(this.value, ...args)
      return new this.constructor(value)
    }

    $get(key) {
      return (...args) => {
        return this.macro(key, args)
      }
    }
  }
}
