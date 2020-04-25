module.exports = {
  exists: require('lodash/includes'),

  flatMap: require('lodash/flatMap'),

  head: require('lodash/head'),

  map: require('lodash/map'),

  some: require('lodash/some'),

  walk: require('lodash/forEach'),

  where: require('lodash/filter'),

  last(source, fallback) {
    return source.length ? source[source.length - 1] : fallback
  },

  wrap(source) {
    if (!source) {
      return []
    }

    if (Array.isArray(source)) {
      return source
    }

    return [source]
  },
}
