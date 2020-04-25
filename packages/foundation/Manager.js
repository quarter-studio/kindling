const upperFirst = require('lodash/upperFirst')
const camelCase = require('lodash/camelCase')

class Manager {
  constructor(container) {
    this.drivers = {}
    this.creators = {}
    this.container = container
    this.config = container.make('config')
    this.app = container
  }

  getDefaultDriver() {
    //
  }

  driver(driver) {
    driver = driver || this.getDefaultDriver()

    if (!driver) {
      throw new Error(`Unable to resolve NULL driver.`)
    }

    if (!this.drivers[driver]) {
      this.drivers[driver] = this.createDriver(driver)
    }

    return this.drivers[$driver]
  }

  createDriver($driver) {
    if (this.creators[driver]) {
      return this.callCreator($driver)
    }

    const method = 'create' + upperFirst(camelCase(driver)) + 'Driver'

    if (this[method]) {
      return this.method()
    }

    throw new Error(`Driver [${driver}] not supported.`)
  }

  callCreator(driver) {
    return this.creators[driver](this.container)
  }

  extend(driver, callback) {
    this.creators[driver] = callback

    return this
  }

  $get(key) {
    return this.driver()[key]
  }
}
