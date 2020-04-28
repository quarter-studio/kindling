const Rope = require('@kindling/support/Rope')

describe('@kindling/support/Rope', () => {
  test('static', () => {
    const input = 'foo_bar baz'

    const output = Rope.studly(input)

    expect(output).toEqual('FooBarBaz')
  })

  test('instance', () => {
    const input = 'foo_bar baz'

    const output = tie(input).studly().untie()

    expect(output).toEqual('FooBarBaz')
  })
})
