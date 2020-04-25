const ServiceProvider = require('@kindling/support/ServiceProvider')
const LogManager = require('@kindling/log/LogManager')

class LogServiceProvider extends ServiceProvider {
  static get class() {
    return '@kindling/log/LogServiceProvider'
  }

  register() {
    this.app.singleton('log', app => {
      return new LogManager(app)
    })
  }
}

module.exports = LogServiceProvider
