const ExceptionsHandler = require('@kindling/foundation/exceptions/Handler')

class Handler extends ExceptionsHandler {
  static get class() {
    return '@app/exceptions/Handler'
  }

  report(exception) {
    super.report(exception)
  }

  render(request, exception) {
    return super.render(request, exception)
  }
}
