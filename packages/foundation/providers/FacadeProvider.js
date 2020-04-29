const Provider = require('@kindling/support/Provider')
const Facade = require('@kindling/support/Facade')

class FacadeProvider extends Provider {
  register() {
    Facade.clearResolvedInstances()
    Facade.app = this.app
  }
}

module.exports = FacadeProvider
