const Str = {
  contains: require('lodash/includes'),

  explode: require('lodash/split'),

  isString: require('lodash/isString'),

  replace: require('lodash/replace'),

  rtrim: require('lodash/trimEnd'),

  startsWith: require('lodash/startsWith'),

  path(...args) {
    return args.filter(Boolean).join('/')
  },
}

module.exports = Str
