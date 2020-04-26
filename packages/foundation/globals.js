global.app = (abstract, ...parameters) => {
  const app = require('@kindling/foundation/Application').instance

  return abstract ? app.makeWith(abstract, parameters) : app
}

global.dd = (...args) => {
  console.log(...args)

  process.exit(0)
}

global.env = (key, fallback) => {
  const get = require('lodash/get')

  return key ? get(process.env, key, fallback) : app('env')
}

global.proxy = (source, proxies = {}) => {
  if (source.$get) {
    proxies.get = (target, key, context) => {
      if (key in target) {
        return Reflect.get(target, key, context)
      } else {
        return target.$get(key)
      }
    }
  }

  if (source.$set) {
    proxies.set = (target, key, value, context) => {
      if (key in target) {
        return Reflect.set(target, key, value, context)
      } else {
        return target.$set(key, value)
      }
    }
  }

  return new Proxy(source, proxies)
}

global.use = (base, traits) => {
  return traits.reduce((base, trait) => {
    trait = trait(base)

    Object.defineProperty(trait, 'name', {
      get() {
        return base.name
      },
    })

    return trait
  }, base)
}
