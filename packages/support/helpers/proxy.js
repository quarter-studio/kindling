const proxy = (source, options) => {
  return new Proxy(source, {
    construct: source.prototype && construct,
    get: source.$get && get,
    set: source.$set && set,
    ...options,
  })
}

const construct = (target, args, context) => {
  const instance = Reflect.construct(target, args, context)

  if (instance.construct) {
    instance.construct.apply(instance, args)
  }

  return proxy(instance)
}

const get = (target, key, context) => {
  if (key in target) {
    return Reflect.get(target, key, context)
  }

  return target.$get(key)
}

const set = (target, key, value, context) => {
  if (key in target) {
    return Reflect.set(target, key, value, context)
  }

  return target.$set(key, value)
}

module.exports = proxy
