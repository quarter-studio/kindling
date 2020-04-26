const Facade = require('@kindling/foundation/Facade')

class DB extends Facade {
  static getFacadeAccessor() {
    return 'db'
  }
}

module.exports = proxy(DB)
