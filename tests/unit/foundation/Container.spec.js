const Container = require('@kindling/foundation/Container')

describe('@kindling/foundation/Container', () => {
  test('bind instance', () => {
    const container = new Container()

    container.instance('instance', 'instanced')

    const instance = container.make('instance')

    expect(instance).toBe('instanced')
  })

  test('bind closure', () => {
    const container = new Container()

    container.bind('closure', (source, param) => {
      expect(source).toBe(container)
      expect(param).toBe('a')

      return 'closured'
    })

    const closure = container.make('closure', 'a')

    expect(closure).toBe('closured')
  })

  test('bind closure', () => {
    const container = new Container()

    container.singleton('singleton', (source, param) => {
      return param
    })

    const a = container.makeWith('singleton', 'a')

    expect(a).toBe('a')

    const b = container.makeWith('singleton', 'b')

    expect(b).toBe('a')
  })

  test('resolve class', () => {
    const container = new Container()

    const instance = container.make('@kindling/foundation/Container')

    expect(instance).toBeInstanceOf(Container)
  })
})
