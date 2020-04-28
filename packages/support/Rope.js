class Rope {
  constructor(value = '') {
    this.value = value
  }

  call(name, args) {
    return this.constructor[name](this.value, args)
  }

  get() {
    return this.value
  }

  untie() {
    return this.value
  }

  $get(key) {
    return (...args) => {
      const value = this.call(key, args)
      return new this.constructor(value)
    }
  }

  static camel(value) {
    return this.call('camelCase', value)
  }

  static studly(value) {
    return this.ucfirst(this.camel(value))
  }

  static ucfirst(value) {
    return this.call('upperFirst', value)
  }

  static call(name, value, args = []) {
    const resolve = require('lodash/' + name)

    return resolve(value, ...args)
  }

  static $get(key) {
    return (value, ...args) => {
      return this.call(key, value, args)
    }
  }
}

module.exports = compose(Rope)
