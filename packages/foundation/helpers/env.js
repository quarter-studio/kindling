module.exports = (key, fallback) => {
  const get = require('lodash/get')

  return key ? get(process.env, key, fallback) : app('env')
}
