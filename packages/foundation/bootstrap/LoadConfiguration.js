const Repository = require('@kindling/config/Repository')
const Finder = require('fs-finder')
const Path = require('path')
const Arr = require('@kindling/support/Arr')
const Str = require('@kindling/support/Str')

class LoadConfiguration {
  static get class() {
    return '@kindling/foundation/bootstrap/LoadConfiguration'
  }

  bootstrap(app) {
    const config = app.instance('config', new Repository())

    this.loadConfigurationFiles(app, config)

    app.detectEnvironment(() => {
      return config.get('app.env', 'production')
    })
  }

  loadConfigurationFiles(app, repository) {
    const files = this.getConfigurationFiles(app)

    if (!files.app) {
      throw new Error('Unable to load the "app" configuration file.')
    }

    Arr.walk(files, (path, key) => {
      repository.set(key, require(path))
    })
  }

  getConfigurationFiles(app) {
    const files = {}

    const configPath = Path.resolve(app.configPath())

    Arr.walk(Finder.from(configPath).findFiles('*.js'), file => {
      const relative = Path.relative(configPath, file)
      const path = Str.rtrim(Str.replace(relative, '/', '.'), '.js')

      files[path] = file
    })

    return files
  }
}
