const Obj = require('@kindling/support/Obj')

const Env = {
  repository: null,

  getRepository() {
    if (Env.repository === null) {
      Env.repository = process.env
    }

    return Env.repository
  },

  get(key, fallback) {
    return Obj.get(Env.getRepository(), key, fallback)
  },
}

module.exports = Env
