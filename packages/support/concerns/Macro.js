module.exports = Base => {
  const symbol = Symbol('extensions')

  return class extends Base {
    get extensions() {
      if (!this[symbol]) {
        this[symbol] = {}
      }

      return this[symbol]
    }

    execute(name, args) {
      if (this.extends(name)) {
        return this.extension.apply(this, args)
      }
    }

    extend(name, extension) {
      this.extensions[name] = extension
    }

    extends(name) {
      return name in this.extensions
    }

    extension(name) {
      return this.extensions[name]
    }
  }
}
