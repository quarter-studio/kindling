const DatabaseManager = require('@kindling/database/DatabaseManager')
const Provider = require('@kindling/foundation/Provider')

class DatabaseProvider extends Provider {
  register() {
    this.app.singleton('db', app => {
      return proxy(new DatabaseManager(app))
    })
  }
}

module.exports = DatabaseProvider
