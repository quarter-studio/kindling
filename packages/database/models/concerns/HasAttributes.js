module.exports = Base => {
  const flatten = require('lodash/flatten')
  const pickBy = require('lodash/pickBy')
  const clone = require('lodash/cloneDeep')
  const empty = require('lodash/isEmpty')
  const some = require('lodash/some')
  const get = require('lodash/get')
  const has = require('lodash/has')
  const set = require('lodash/set')

  return class extends Base {
    constructor(...args) {
      super(...args)
      this.attributes = {}
      this.original = {}
      this.changes = {}
    }

    getAttribute(key, value) {
      return get(this.attributes, key, value)
    }

    hasAttribute(key) {
      return has(this.attributes, key)
    }

    setAttribute(key, value) {
      set(this.attributes, key, value)

      return proxy(this)
    }

    setAttributes(attributes, sync) {
      this.attributes = attributes

      if (sync) {
        this.syncOriginal()
      }

      return proxy(this)
    }

    getOriginal(key, value) {
      return get(this.original, key, value)
    }

    setOriginal(key, value) {
      set(this.original, key, value)

      return proxy(this)
    }

    syncOriginal(...keys) {
      if (empty(keys)) {
        this.original = clone(this.attributes)
      } else {
        flatten(keys).forEach(key => {
          this.setOriginal(key, this.getAttribute(key))
        })
      }

      return proxy(this)
    }

    syncChanges() {
      this.changes = this.getDirty()

      return proxy(this)
    }

    isClean(...keys) {
      return !this.isDirty(...keys)
    }

    isDirty(...keys) {
      return this.hasChanges(this.getDirty(), flatten(keys))
    }

    getDirty() {
      return pickBy(this.attributes, key => {
        return this.hasChanged(key)
      })
    }

    wasChanged(...keys) {
      return this.hasChanges(this.changes, flatten(keys))
    }

    hasChanges(changes, keys) {
      if (empty(keys)) {
        return !empty(changes)
      }

      return some(keys, keys => {
        return has(changes, key)
      })
    }

    hasChanged(key) {
      if (!has(this.original, key)) {
        return true
      }

      const attribute = this.getAttribute(key)
      const original = this.getOriginal(key)

      if (attribute === original) {
        return false
      }

      return true
    }
  }
}
