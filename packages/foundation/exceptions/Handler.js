class Kernel {
  static get class() {
    return '@kindling/foundation/exceptions/Handler'
  }

  constructor(container) {
    this.$container = container
  }

  report(exception) {
    //
  }

  render(request, exception) {
    console.log(request)
    console.error(exception)
  }

  renderForConsole(output, exception) {
    console.log(output)
    console.error(exception)
  }
}

module.exports = Kernel
