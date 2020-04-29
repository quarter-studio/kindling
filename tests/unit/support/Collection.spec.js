describe('@kindling/support/Collection', () => {
  test('mutate source', () => {
    const input = { foo: 'bar' }

    const container = collect(input)

    const output = container.assign({ biz: 'baz' })

    expect(input).toEqual(output.value)

    expect(input).toEqual({ foo: 'bar', biz: 'baz' })
  })

  test('immutable source', () => {
    const input = ['foo', 'bar']

    const container = collect(input)

    const output = container.map(value => {
      return value + 's'
    })

    expect(input).not.toEqual(output.value)

    expect(input).toEqual(['foo', 'bar'])

    expect(output.value).toEqual(['foos', 'bars'])
  })
})
