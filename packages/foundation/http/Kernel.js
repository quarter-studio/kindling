const ExceptionHandler = require('@kindling/contracts/debug/ExceptionHandler')

class Kernel {
  static get class() {
    return '@kindling/foundation/http/Kernel'
  }

  constructor(app) {
    this.$app = app

    this.$bootstrappers = [
      '@kindling/foundation/bootstrap/LoadEnvironmentVariables',
      '@kindling/foundation/bootstrap/LoadConfiguration',
      '@kindling/foundation/bootstrap/RegisterProviders',
      '@kindling/foundation/bootstrap/BootProviders',
    ]
  }

  handle(request) {
    try {
      return this.sendRequest(request)
    } catch (error) {
      this.reportException(error)

      return this.renderException(request, error)
    }
  }

  sendRequest(request) {
    this.$app.instance('request', request)

    this.bootstrap()

    return {}
  }

  bootstrap() {
    if (!this.$app.hasBeenBootstrapped()) {
      this.$app.bootstrapWith(this.$bootstrappers)
    }
  }

  terminate(request, response) {
    this.$app.terminate()
  }

  reportException(error) {
    this.$app.make(ExceptionHandler).report(error)
  }

  renderException(request, error) {
    return this.$app.make(ExceptionHandler).render(request, error)
  }
}

module.exports = Kernel
