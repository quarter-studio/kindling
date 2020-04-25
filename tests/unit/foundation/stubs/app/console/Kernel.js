const ConsoleKernel = require('@kindling/foundation/console/Kernel')

class Kernel extends ConsoleKernel {
  static get class() {
    return '@app/console/Kernel'
  }
}
