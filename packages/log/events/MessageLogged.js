class MessageLogged {
  static get class() {
    return '@kindling/log/events/MessageLogged'
  }

  constructor(level, $essage, context) {
    this.$level = level
    this.$message = message
    this.$context = context
  }
}
