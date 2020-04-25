const ServiceProvider = require('@kindling/support/ServiceProvider')
const Dispatcher = require('@kindling/events/Dispatcher')

class EventServiceProvider extends ServiceProvider {
  static get class() {
    return '@kindling/events/EventServiceProvider'
  }

  register() {
    this.app.singleton('events', app => {
      return new Dispatcher()
    })
  }
}

module.exports = EventServiceProvider
