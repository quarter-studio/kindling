const Provider = require('@kindling/foundation/Provider')
const Dotenv = require('dotenv')

class EnvironmentProvider extends Provider {
  register() {
    Dotenv.config({
      path: this.app.environmentFilePath(),
    })
  }
}

module.exports = EnvironmentProvider
