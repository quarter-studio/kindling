class FirestoreDriver {
  constructor(app, config) {
    this.config = config
  }

  get project() {
    return this.config.project
  }
}

module.exports = FirestoreDriver
