const Utility = require('@kindling/support/concerns/Utility')

class Rope {
  constructor(value) {
    this.value = value || ''
  }

  camel() {
    return this.macro('camelCase')
  }

  get() {
    return this.value
  }

  method(prefix, suffix) {
    return this.studly().wrap(prefix, suffix).untie()
  }

  or(value) {
    return new this.constructor(this.value || value)
  }

  remove(value) {
    return this.replace(value, '')
  }

  studly(value) {
    return this.camel().ucfirst()
  }

  ucfirst() {
    return this.macro('upperFirst')
  }

  untie() {
    return this.value
  }

  wrap(prefix = '', suffix = '') {
    return new this.constructor(prefix + this.value + suffix)
  }
}

module.exports = compose(Rope, [Utility])
