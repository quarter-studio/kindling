const Manager = require('@kindling/foundation/Manager')

class DatabaseManager extends Manager {
  createFirestoreDriver(container, config) {
    return container.make('@kindling/database/drivers/FirestoreDriver', config)
  }
}

module.exports = DatabaseManager
