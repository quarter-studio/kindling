const Application = require('@kindling/foundation/Application')

describe('@kindling/foundation/Application', () => {
  test('setup environment', () => {
    const app = require('../../stubs/project/boot/app')

    expect(app.get('config').get('app.name')).toBe('Testing')

    expect(app.environment()).toBe('production')

    expect(app.getLocale()).toBe('en')
  })
})
