const Application = require('@kindling/foundation/Application')
const DB = require('@kindling/foundation/facades/DB')

describe('@kindling/foundation/Application', () => {
  test('setup environment', () => {
    const app = require('../../stubs/project/boot/app')

    // expect(app.get('config').get('app.name')).toBe('Testing')

    expect(app.environment()).toBe('testing')

    expect(app.testing).toBe(true)

    expect(app.live).toBe(false)

    expect(app.locale).toBe('en')

    expect(DB.project).toBe('project-id')

    expect(DB.create('alt').project).toBe('project-alt')
  })
})
