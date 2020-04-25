const Arr = require('@kindling/support/Arr')
const Str = require('@kindling/support/Str')

class Dispatcher {
  static get class() {
    return '@kindling/events/Dispatcher'
  }

  constructor(container) {
    this.$listeners = {}
  }

  listen(events, listener) {
    Arr.walk(Arr.wrap(events), event => {
      const listeners = Obj.getOrSet(this.$listeners, event, [])

      listeners.push(this.makeListener(listener))
    })
  }

  hasListeners(eventName) {
    return eventName in this.$listeners
  }

  getListeners(eventName) {
    return this.listeners[eventName] || []
  }

  dispatch($event, $payload, halt = false) {
    const [event, payload] = this.parseEventAndPayload($event, $payload)

    const listeners = this.getListeners(event)

    const responses = []

    for (const listener of listeners) {
      const response = listener(event, ...payload)

      if (halt && response !== null) {
        return response
      }

      if (response === false) {
        break
      }

      responses.push(response)
    }

    return halt ? undefined : responses
  }

  parseEventAndPayload(event, payload) {
    if (Str.isString(event)) {
      return [event, Arr.wrap(payload)]
    }

    return [event.constructor.class, [event]]
  }
}

module.exports = Dispatcher
