require('@kindling/support/globals')
require('@kindling/foundation/globals')

collect(process.env).assign({
  APP_ENV: 'testing',
  FOO: 'bar',
})
