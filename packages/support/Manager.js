const Cache = require('@kindling/support/concerns/Cache')
const Macro = require('@kindling/support/concerns/Macro')

class Manager {
  constructor(container) {
    this.container = container
  }

  create(service) {
    service = service || this.service()

    return this.resolve(service)
  }

  produce(service) {
    const config = this.config(service)

    if (!config) {
      throw new Error(
        `${this.constructor.name} service [${service}] is not defined.`
      )
    }

    return this.driver(config.driver, config)
  }

  driver(driver, config) {
    const creator = this.extension(driver) || this.creator(driver)

    if (creator) {
      return creator.call(this, this.container, config)
    }

    throw new Error(
      `${this.constructor.name} driver [${driver}] is not defined.`
    )
  }

  creator(driver) {
    return this[tie(driver).method('create', 'Driver')]
  }

  config(service) {
    return this.container.get('config').get([this.name, this.key, service])
  }

  service(path = 'default') {
    return this.container.get('config').get([this.name, path])
  }

  get name() {
    return tie(this.constructor.name).remove('Manager').camel().untie()
  }

  get key() {
    return 'services'
  }

  $get(key) {
    const service = this.create()
    const value = service[key]

    if (typeof value === 'function') {
      return value.bind(service)
    }

    return value
  }
}

module.exports = compose(Manager, [Cache, Macro])
