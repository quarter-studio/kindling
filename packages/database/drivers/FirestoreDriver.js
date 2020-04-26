class FirestoreDriver {
  constructor(app, config) {
    this.config = config
  }

  getProject() {
    return this.config.project
  }
}

module.exports = FirestoreDriver
