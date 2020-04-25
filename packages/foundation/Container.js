class Container {
  constructor() {
    this.instances = {}
    this.bindings = {}
    this.aliases = {}
  }

  alias(abstract, alias) {
    if (alias === abstract) {
      throw new Error(`[${abstract}] cannot be aliased to itself.`)
    }

    this.aliases[alias] = abstract
  }

  singleton(abstract, concrete) {
    this.bind(abstract, concrete, true)
  }

  instance(abstract, instance) {
    delete this.aliases[abstract]

    this.instances[abstract] = instance

    return instance
  }

  bind(abstract, concrete, shared = false) {
    if (!concrete) {
      concrete = abstract
    }

    if (typeof concrete !== 'function') {
      concrete = this.getClosure(concrete)
    }

    this.bindings[abstract] = { concrete, shared }
  }

  get(abstract) {
    return this.makeWith(abstract, [])
  }

  make(abstract, ...parameters) {
    return this.makeWith(abstract, parameters)
  }

  makeWith(abstract, parameters) {
    return this.resolve(abstract, parameters)
  }

  resolve(abstract, parameters = []) {
    abstract = this.getAlias(abstract)

    if (abstract in this.instances) {
      return this.instances[abstract]
    }

    const concrete = this.getConcrete(abstract)

    const instance = this.isBuildable(concrete, abstract)
      ? this.build(concrete, parameters)
      : this.makeWith(concrete, parameters)

    if (this.isShared(abstract)) {
      this.instances[abstract] = instance
    }

    return instance
  }

  build(concrete, parameters) {
    if (typeof concrete === 'function') {
      return concrete(this, ...parameters)
    }

    concrete = require(concrete)

    return new concrete(this, ...parameters)
  }

  getAlias(abstract) {
    const alias = this.aliases[abstract]

    return alias ? this.getAlias(alias) : abstract
  }

  getBinding(abstract) {
    return this.bindings[abstract] || {}
  }

  getClosure(concrete) {
    return (container, parameters) => {
      return container.resolve(concrete, parameters)
    }
  }

  getConcrete(abstract) {
    return this.getBinding(abstract).concrete || abstract
  }

  isBuildable(concrete, abstract) {
    return concrete === abstract || typeof concrete === 'function'
  }

  isShared(abstract) {
    return (
      abstract in this.instances || this.getBinding(abstract).shared === true
    )
  }
}

module.exports = Container
