const Repository = require('@kindling/foundation/Repository')
const Provider = require('@kindling/foundation/Provider')
const Finder = require('fs-finder')
const Path = require('path')

class ConfigProvider extends Provider {
  register() {
    const config = new Repository()

    this.app.instance('config', config)

    this.loadConfigFiles(this.app, config)

    this.registerEnvironment(this.app, config)

    this.registerProviders(this.app, config)
  }

  loadConfigFiles(app, config) {
    this.getFiles(app).forEach(file => {
      config.set(file.key, file.value)
    })
  }

  getFiles(app) {
    const configPath = app.configPath()
    const filePaths = Finder.from(configPath).findFiles('*.js')

    return filePaths.map(filePath => {
      const relativePath = Path.relative(configPath, filePath)
      const value = require(filePath)
      const key = relativePath.slice(0, -3).split('/').join('.')

      return { key, value }
    })
  }

  registerEnvironment(app, config) {
    app.instance('env', config.get('app.env', 'production'))
  }

  registerProviders(app, config) {
    config.get('app.providers').forEach(provider => {
      app.register(provider)
    })
  }
}

module.exports = ConfigProvider
