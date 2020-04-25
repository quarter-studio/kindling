const Filesystem = require('fs')
const Commander = require('commander')
const Dotenv = require('dotenv')
const Env = require('@kindling/support/Env')

class LoadEnvironmentVariables {
  static get class() {
    return '@kindling/foundation/bootstrap/LoadEnvironmentVariables'
  }

  bootstrap(app) {
    this.checkForSpecificEnvironmentFile(app)

    try {
      Dotenv.config({
        path: app.environmentFilePath(),
      })
    } catch (error) {
      console.error('The environment file is invalid!')
      console.error(error.message)
      process.exit(1)
    }
  }

  checkForSpecificEnvironmentFile(app) {
    const args = Commander.program.option('-env <env>').parse(process.argv)
    const file = app.environmentFile()
    const env = args.env || Env.get('APP_ENV')

    if (env) {
      this.setEnvironmentFilePath(app, file + '.' + env)
    }
  }

  setEnvironmentFilePath(app, file) {
    const path = app.environmentPath(file)

    if (Filesystem.existsSync(path)) {
      app.loadEnvironmentFrom(file)
    }
  }
}
