const Container = require('@kindling/container/Container')

describe('@kindling/container/Container', () => {
  test('bind instance', () => {
    const container = new Container()

    container.instance('instance', 'instanced')

    const instance = container.make('instance')

    expect(instance).toBe('instanced')
  })

  test('bind closure', () => {
    const container = new Container()
    const parameters = {}

    container.bind('closure', (source, params) => {
      expect(source).toBe(container)
      expect(params).toBe(parameters)

      return 'closured'
    })

    const closure = container.makeWith('closure', parameters)

    expect(closure).toBe('closured')
  })

  test('bind closure', () => {
    const container = new Container()

    container.singleton('singleton', (source, params) => {
      return params.name
    })

    const a = container.makeWith('singleton', { name: 'a' })

    expect(a).toBe('a')

    const b = container.makeWith('singleton', { name: 'b' })

    expect(b).toBe('a')
  })

  test('resolve class', () => {
    const container = new Container()

    const instance = container.make('@kindling/container/Container')

    expect(instance).toBeInstanceOf(Container)
  })

  test('bind class', () => {
    const container = new Container()

    class Class {
      static get class() {
        return 'Class'
      }
    }

    container.bind('class', Class)

    const instance = container.make('class')

    expect(instance).toBeInstanceOf(Class)
  })
})
