const DatabaseManager = require('@kindling/database/DatabaseManager')
const Provider = require('@kindling/support/Provider')

class DatabaseProvider extends Provider {
  register() {
    this.app.singleton('db', app => {
      return new DatabaseManager(app)
    })
  }
}

module.exports = DatabaseProvider
