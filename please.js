// class Foo {
//   static class = '@foo/bar/base'
// }

// console.log(Foo.class)

class Base {}

const Proxied = new Proxy(Base, {
  construct(a, b, c, d) {
    console.log(a)
    return Reflect.construct(a, b, c, d)
  },
  // getPrototypeOf
  // setPrototypeOf
  // isExtensible
  // preventExtensions
  // getOwnPropertyDescriptor
  // defineProperty
  // has
  // get
  // set
  // ownKeys
  // apply
  // construct
})

class Extended extends Proxied {}

console.log(Extended)
console.log(new Extended())
