const Provider = require('@kindling/foundation/Provider')

class BootProvider extends Provider {
  register() {
    this.app.boot()
  }
}

module.exports = BootProvider
