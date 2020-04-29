const Provider = require('@kindling/support/Provider')

class BootProvider extends Provider {
  register() {
    this.app.boot()
  }
}

module.exports = BootProvider
