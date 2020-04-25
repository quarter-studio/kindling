global.app = (abstract, ...parameters) => {
  const app = require('@kindling/foundation/Application').instance
  return abstract ? app.makeWith(abstract, parameters) : app
}

global.env = (key, fallback) => {
  const get = require('lodash/get')
  return key ? get(process.env, key, fallback) : app('env')
}

global.proxy = (source, proxies) => {
  if (source.$get) {
    proxies.get = (target, key, context) => {
      if (key in target) {
        return Reflect.get(target, key, context)
      } else {
        return target.$get.call(context, key)
      }
    }
  }

  if (source.$set) {
    proxies.set = (target, key, value, context) => {
      if (key in target) {
        return Reflect.set(target, key, value, context)
      } else {
        return target.$set.call(context, key, value)
      }
    }
  }

  return new Proxy(source, proxies)
}
