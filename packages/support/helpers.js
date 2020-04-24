Object.assign(global, {
  empty: require('lodash/isEmpty'),

  get_class(source) {
    return source && source.class
  },

  is_class(source) {
    return !!get_class(source)
  },

  is_closure(source) {
    return typeof source === 'function' && !is_class(source)
  },

  proxy(source, proxies = {}) {
    if (source.$get) {
      proxies.get = function (target, key, context) {
        if (target[key] === undefined) {
          return target.$get.call(context, key)
        } else {
          return target[key]
        }
      }
    }

    if (source.$set) {
      proxies.set = function (target, key, value, context) {
        if (target[key] === undefined) {
          return target.$set.call(context, key, value)
        } else {
          source[key] = value
          return true
        }
      }
    }

    if (source.$delete) {
      proxies.deleteProperty = function (target, key, context) {
        if (key in target) {
          delete target[key]
        } else {
          target.$delete.call(context, key)
        }
      }
    }

    if (Object.keys(proxies).length) {
      return new Proxy(source, proxies)
    } else {
      return source
    }
  },

  unwrap(source) {
    return is_closure(source) ? source() : source
  },
})
