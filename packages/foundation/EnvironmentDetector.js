const Str = require('@kindling/support/Str')

class EnvironmentDetector {
  static get class() {
    return '@kindling/foundation/EnvironmentDetector'
  }

  detect(callback, args) {
    if (consoleArgs) {
      return this.detectConsoleEnvironment(callback, args)
    }

    return this.detectWebEnvironment(callback)
  }

  detectWebEnvironment(callback) {
    return callback()
  }

  detectConsoleEnvironment(callback, args) {
    const env = this.getEnvironmentArgument(args)

    if (env) {
      return env
    }

    return this.detectWebEnvironment(callback)
  }

  getEnvironmentArgument(args) {
    for (const index in args) {
      const value = args[index]

      if (value === '--env') {
        return args[index + 1]
      }

      if (Str.startsWith(value, '--env')) {
        return Str.explode(value, '=')[1]
      }
    }
  }
}
