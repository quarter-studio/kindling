const Provider = require('@kindling/foundation/Provider')
const Facade = require('@kindling/foundation/Facade')

class FacadeProvider extends Provider {
  register() {
    Facade.clearResolvedInstances()
    Facade.app = this.app
  }
}

module.exports = FacadeProvider
