const Arr = require('@kindling/support/Arr')
const Obj = require('@kindling/support/Obj')
const Str = require('@kindling/support/Str')

class Container {
  static get class() {
    return '@kindling/container/Container'
  }

  constructor() {
    this.$instances = {}
    this.$bindings = {}
    this.$aliases = {}
    this.$with = []
  }

  bound(abstract) {
    return (
      abstract in this.$bindings ||
      abstract in this.$instances ||
      this.isAlias(abstract)
    )
  }

  isShared(abstract) {
    return (
      abstract in this.$instances || this.getBinding(abstract).shared === true
    )
  }

  isAlias(name) {
    return name in this.$aliases
  }

  bind(abstract, concrete, shared = false) {
    if (!concrete) {
      concrete = abstract
    }

    if (!is_closure(concrete)) {
      concrete = this.getClosure(abstract, concrete)
    }

    this.$bindings[abstract] = { concrete, shared }
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
    delete this.$aliases[abstract]

    this.$instances[abstract] = instance

    return instance
  }

  alias(abstract, alias) {
    if (alias === abstract) {
      throw new Error(`[${abstract}] is aliased to itself.`)
    }

    this.$aliases[alias] = abstract
  }

  make(abstract, ...parameters) {
    return this.makeWith(abstract, parameters)
  }

  makeWith(abstract, parameters) {
    return this.resolve(abstract, parameters)
  }

  resolve(abstract, parameters = {}, raiseEvents = true) {
    abstract = this.getAlias(abstract)

    if (abstract in this.$instances) {
      return this.$instances[abstract]
    }

    this.$with.push(parameters)

    const concrete = this.getConcrete(abstract)

    const object = this.isBuildable(concrete, abstract)
      ? this.build(concrete)
      : this.make(concrete)

    if (this.isShared(abstract)) {
      this.$instances[abstract] = object
    }

    this.$with.pop()

    return object
  }

  getConcrete(abstract) {
    return this.getBinding(abstract).concrete || abstract
  }

  isBuildable(concrete, abstract) {
    return concrete === abstract || is_closure(concrete)
  }

  build(concrete) {
    if (is_closure(concrete)) {
      return concrete(this, this.getLastParameters())
    }

    if (Str.isString(concrete)) {
      concrete = this.resolveClass(concrete)
    }

    const dependencies = this.getLastParameters()

    return new concrete(dependencies)
  }

  getLastParameters() {
    return Arr.last(this.$with, {})
  }

  resolveClass(abstract) {
    const concrete = require(abstract)

    this.bind(abstract, concrete)

    if (concrete.class && concrete.class !== abstract) {
      this.bind(concrete.class, concrete)
    }

    return concrete
  }

  getBinding(abstract) {
    return Obj.get(this.$bindings, abstract, {})
  }

  getAlias(abstract) {
    const alias = this.$aliases[abstract]

    return alias ? this.getAlias(alias) : abstract
  }

  flush() {
    this.$instances = {}
    this.$bindings = {}
    this.$aliases = {}
  }

  static getInstance() {
    return Obj.getOrSet(this, '$instance', new this())
  }

  static setInstance(container) {
    return (this.$instance = container)
  }
}

module.exports = Container
