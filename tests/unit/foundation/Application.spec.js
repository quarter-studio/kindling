const Application = require('@kindling/foundation/Application')

const basePath = require('path').resolve(__dirname, 'stubs')

describe('@kindling/foundation/Application', () => {
  test('setup environment', () => {
    const app = new Application(basePath)

    expect(app.path()).toBe(basePath + '/app')

    // expect(app.environment()).toBe('local')
  })
})
