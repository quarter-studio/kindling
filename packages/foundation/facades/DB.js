const Facade = require('@kindling/support/Facade')

class DB extends Facade {
  static getFacadeAccessor() {
    return 'db'
  }
}

module.exports = proxy(DB)
