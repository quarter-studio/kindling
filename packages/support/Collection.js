class Collection {
  constructor(source = []) {
    this.source = source
  }

  all() {
    return this.source
  }

  call(name, args) {
    const resolve = require('lodash/' + name)
    const value = resolve(this.source, ...args)
    return new this.constructor(value)
  }

  $get(key) {
    return (...args) => {
      return this.call(key, args)
    }
  }
}

module.exports = compose(Collection)
