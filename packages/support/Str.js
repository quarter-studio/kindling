module.exports = {
  isString: require('lodash/isString'),

  rtrim: require('lodash/trimEnd'),

  path(...args) {
    return args.filter(Boolean).join('/')
  },
}
