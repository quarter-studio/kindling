const Application = require('@kindling/foundation/Application')

const basePath = require('path').resolve(__dirname, '..')

const app = new Application(basePath)

app.singleton(
  require('@kindling/contracts/http/Kernel'),
  require('../app/http/Kernel')
)

app.singleton(
  require('@kindling/contracts/console/Kernel'),
  require('../app/console/Kernel')
)

app.singleton(
  require('@kindling/contracts/debug/ExceptionHandler'),
  require('../app/exceptions/Handler')
)

module.exports = app
