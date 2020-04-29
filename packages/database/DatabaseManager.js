const Manager = require('@kindling/support/Manager')

class DatabaseManager extends Manager {
  createFirestoreDriver(container, config) {
    return container.make('@kindling/database/drivers/FirestoreDriver', config)
  }
}

module.exports = compose(DatabaseManager)
