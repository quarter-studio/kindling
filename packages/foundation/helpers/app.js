module.exports = (abstract, ...parameters) => {
  const app = require('@kindling/foundation/Application').instance

  return abstract ? app.makeWith(abstract, parameters) : app
}
