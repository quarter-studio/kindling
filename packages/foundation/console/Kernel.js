const ExceptionHandler = require('@kindling/contracts/debug/ExceptionHandler')

class Kernel {
  static get class() {
    return '@kindling/foundation/console/Kernel'
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

  handle(input, output) {
    try {
      return this.run(input, output)
    } catch (error) {
      this.reportException(error)

      return this.renderException(output, error)
    }
  }

  sendRequest(input, output) {
    this.$app.instance('input', input)
    this.$app.instance('output', output)

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

  renderException(output, error) {
    return this.$app.make(ExceptionHandler).renderForConsole(output, error)
  }
}

module.exports = Kernel
