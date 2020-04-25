const HttpKernel = require('@kindling/foundation/http/Kernel')

class Kernel extends HttpKernel {
  static get class() {
    return '@app/http/Kernel'
  }
}
