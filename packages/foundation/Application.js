const Container = require('@kindling/foundation/Container')
const Path = require('path')

class Application extends Container {
  constructor(cwd) {
    super()
    this.providers = []
    this.setBasePath(cwd)
    this.registerBaseBindings()
    this.registerBaseProviders()
  }

  registerBaseBindings() {
    this.constructor.instance = this

    this.instance('app', this)

    this.instance('container', this)

    this.instance('env', process.env.NODE_ENV || 'production')
  }

  registerBaseProviders() {
    this.register('@kindling/foundation/providers/EnvironmentProvider')
    this.register('@kindling/foundation/providers/ConfigProvider')
    this.register('@kindling/foundation/providers/FacadeProvider')
  }

  setBasePath(cwd) {
    this.cwd = Path.resolve(cwd)

    this.bindPathsInContainer()

    return this
  }

  bindPathsInContainer() {
    this.instance('path', this.path())
    this.instance('path.base', this.basePath())
    this.instance('path.lang', this.langPath())
    this.instance('path.config', this.configPath())
    this.instance('path.storage', this.storagePath())
    this.instance('path.resource', this.resourcePath())
  }

  basePath(...path) {
    return Path.resolve(this.cwd, ...path)
  }

  path(...path) {
    return this.basePath('app', ...path)
  }

  langPath(...path) {
    return this.resourcePath('lang', ...path)
  }

  configPath(...path) {
    return this.basePath('config', ...path)
  }

  storagePath(...path) {
    return this.basePath('storage', ...path)
  }

  resourcePath(...path) {
    return this.basePath('resources', ...path)
  }

  environmentFilePath() {
    return this.basePath('.env')
  }

  environment(...envs) {
    const env = this.make('env')

    if (envs.length) {
      return envs.includes(env)
    }

    return env
  }

  get live() {
    return this.environment('production')
  }

  get testing() {
    return this.environment('testing')
  }

  register(provider) {
    if (typeof provider === 'string') {
      provider = this.make(provider)
    }

    provider.register()

    this.providers.push(provider)

    if (this.booted) {
      provider.boot()
    }

    return provider
  }

  boot() {
    if (this.booted) {
      return
    }

    this.providers.forEach(provider => {
      provider.boot()
    })

    this.booted = true
  }

  get locale() {
    return this.get('config').get('app.locale')
  }

  set locale(locale) {
    this.get('config').set('app.locale', locale)
    this.get('translator').setLocale(locale)
  }

  isLocale(locale) {
    return this.locale === locale
  }
}

module.exports = Application
