const symbol = Symbol.for('traits')

module.exports = (base, traits = []) => {
  return proxy(
    traits.reduce((base, trait) => {
      base[symbol] = base[symbol] || []

      base[symbol].push(trait)

      trait = trait(base)

      Object.defineProperty(trait, 'name', {
        get() {
          return base.name
        },
      })

      return trait
    }, base)
  )
}
