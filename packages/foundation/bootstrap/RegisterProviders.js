class BootProviders {
  static get class() {
    return '@kindling/foundation/bootstrap/RegisterProviders'
  }

  bootstrap(app) {
    app.registerConfiguredProviders()
  }
}
