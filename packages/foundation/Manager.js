const upperFirst = require('lodash/upperFirst')
const camelCase = require('lodash/camelCase')
const replace = require('lodash/replace')

class Manager {
  constructor(container) {
    this.config = container.make('config')
    this.container = container
    this.services = {}
    this.creators = {}
  }

  getKey() {
    return 'services'
  }

  getName() {
    return camelCase(replace(this.constructor.name, 'Manager', '')) || 'Manager'
  }

  getConfig(service) {
    return this.config.get([this.getName(), this.getKey(), service])
  }

  getDefaultService(path = 'default') {
    return this.config.get([this.getName(), path])
  }

  create(service) {
    service = service || this.getDefaultService()

    if (!this.services[service]) {
      this.services[service] = this.service(service)
    }

    return this.services[service]
  }

  service(service) {
    const config = this.getConfig(service)

    if (!config) {
      throw new Error(
        `${upperFirst(this.getName())} service [${service}] is not defined.`
      )
    }

    return this.driver(config.driver, config)
  }

  driver(driver, config) {
    const creator = this.creators[driver]

    if (creator) {
      return creator(this.container, config)
    }

    const method = this[`create${upperFirst(camelCase(driver))}Driver`]

    if (method) {
      return method(this.container, config)
    }

    throw new Error(
      `${upperFirst(this.getName())} driver [${driver}] is not defined.`
    )
  }

  extend(driver, callback) {
    this.creators[driver] = callback

    return proxy(this)
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

module.exports = Manager
