const Utility = require('@kindling/support/concerns/Utility')

class Collection {
  constructor(value = []) {
    this.value = value
  }

  all() {
    return this.value
  }

  get(...args) {
    const collection = args.length ? this.macro('get', args) : this

    return collection.value
  }
}

module.exports = compose(Collection, [Utility])
