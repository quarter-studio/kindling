const Arr = require('@kindling/support/Arr')
const Obj = require('@kindling/support/Obj')

class Container {
  static get class() {
    return '@kindling/container/Container'
  }

  constructor() {
    this.instances = {}
    this.bindings = {}
    this.aliases = {}
    this.with = []
  }

  bound(abstract) {
    return abstract in this.bindings || abstract in this.instances || this.isAlias(abstract)
  }

  isShared(abstract) {
    return this.instances.has(abstract) || this.getBinding(abstract).shared === true
  }

  isAlias(name) {
    return name in this.aliases
  }

  bind(abstract, concrete, shared = false) {
    if (!concrete) {
      concrete = abstract
    }

    if (!is_closure(concrete)) {
      concrete = this.getClosure(abstract, concrete)
    }

    this.bindings[abstract] = { concrete, shared }
  }

  getClosure(abstract, concrete) {
    return (container, parameters) => {
      if (abstract === concrete) {
        return container.build(concrete)
      }

      return container.resolve(concrete, parameters, false)
    }
  }

  singleton(abstract, concrete) {
    this.bind(abstract, concrete, true)
  }

  instance(abstract, instance) {
    delete this.aliases[abstract]

    this.instances[abstract] = instance

    return instance
  }

  alias(abstract, alias) {
    if (alias === abstract) {
      throw new Error(`[${abstract}] is aliased to itself.`)
    }

    this.aliases[alias] = abstract
  }

  make(abstract, ...parameters) {
    return this.makeWith(abstract, parameters)
  }

  makeWith(abstract, parameters) {
    return this.resolve(abstract, parameters)
  }

  resolve(abstract, parameters = {}, raiseEvents = true) {
    abstract = this.getAlias(abstract)

    if (abstract in this.instances) {
      return this.instances[abstract]
    }

    this.with.push(parameters)

    const concrete = this.getConcrete(abstract)

    const object = this.isBuildable(concrete, abstract) ? this.build(concrete) : this.make(concrete)

    if (this.isShared(abstract)) {
      this.instances[abstract] = object
    }

    this.with.pop()

    return object
  }

  getConcrete(abstract) {
    return Object.get(this.bindings, abstract + '.concrete', abstract)
  }

  isBuildable(concrete, abstract) {
    return concrete === abstract || is_closure(concrete)
  }

  build(concrete) {
    if (is_closure(concrete)) {
      // TODO: spread parameters?
      return concrete(this, this.getLastParameterOverride())
    }

    const constructor = reflector.getConstructor()

    if (!constructor) {
      return new concrete()
    }

    const dependencies = constructor.getParameters()

    const instances = this.resolveDependencies(dependencies)

    return reflector.newInstanceArgs(instances)
  }

  getLastParameterOverride() {
    return Arr.last(this.with, {})
  }

  resolveClass(abstract) {
    this.bind(abstract, require(abstract))

    return abstract
  }

  getBinding(abstract) {
    return Object.get(this.bindings, abstract, {})
  }

  getAlias(abstract) {
    const alias = this.aliases[abstract]

    return alias ? this.getAlias(alias) : abstract
  }

  flush() {
    this.instances = {}
    this.bindings = {}
    this.aliases = {}
  }

  static getInstance() {
    return Object.getOrSet(this, 'instance', new this())
  }

  static setInstance(container) {
    return (this.instance = container)
  }
}

module.exports = Container
