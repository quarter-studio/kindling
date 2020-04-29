module.exports = Base => {
  const symbol = Symbol('cache')

  return class extends Base {
    get cache() {
      if (!this[symbol]) {
        this[symbol] = {}
      }

      return this[symbol]
    }

    resolve(key) {
      if (this.cached(key)) {
        return this.cache[key]
      }

      this.cache[key] = this.produce(key)

      return this.cache[key]
    }

    realize(key) {
      //
    }

    cached(name) {
      return name in this.cache
    }
  }
}
