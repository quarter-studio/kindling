describe('@kindling/support/Collection', () => {
  test('mutate source', () => {
    const input = { foo: 'bar' }

    const container = collect(input)

    const output = container.assign({ biz: 'baz' })

    expect(input).toEqual(output.source)

    expect(input).toEqual({ foo: 'bar', biz: 'baz' })
  })

  test('immutable source', () => {
    const input = ['foo', 'bar']

    const container = collect(input)

    const output = container.map(value => {
      return value + 's'
    })

    expect(input).not.toEqual(output.source)

    expect(input).toEqual(['foo', 'bar'])

    expect(output.source).toEqual(['foos', 'bars'])
  })
})
