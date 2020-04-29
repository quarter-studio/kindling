class Facade {
  static swap(instance) {
    const accessor = this.getFacadeAccessor()

    this.resolvedInstances[accessor] = instance

    if (this.app) {
      this.app.instance(accessor, instance)
    }
  }

  static getFacadeRoot() {
    return this.resolveFacadeInstance(this.getFacadeAccessor())
  }

  static getFacadeAccessor() {
    throw new Error(`${this.name} does not implement getFacadeAccessor method.`)
  }

  static resolveFacadeInstance(name) {
    if (name && typeof name !== 'string') {
      return name
    }

    if (this.resolvedInstances[name]) {
      return this.resolvedInstances[name]
    }

    if (this.app) {
      this.resolvedInstances[name] = this.app.get(name)

      return this.resolvedInstances[name]
    }
  }

  static clearResolvedInstance(name) {
    delete this.resolvedInstances[name]
  }

  static clearResolvedInstances() {
    this.resolvedInstances = {}
  }

  static $get(key) {
    const instance = this.getFacadeRoot()

    if (!instance) {
      throw new RuntimeException('A facade root has not been set.')
    }

    const value = instance[key]

    if (typeof value === 'function') {
      return function () {
        return value.apply(instance, arguments)
      }
    }

    return value
  }
}

module.exports = Facade
