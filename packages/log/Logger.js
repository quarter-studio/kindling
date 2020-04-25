// <?php

// namespace Illuminate\Log;

// use Closure;
// use Illuminate\Contracts\Events\Dispatcher;
// use Illuminate\Contracts\Support\Arrayable;
// use Illuminate\Contracts\Support\Jsonable;
// use Illuminate\Log\Events\MessageLogged;
// use Psr\Log\LoggerInterface;
// use RuntimeException;

class Logger {
  static get class() {
    return '@kindling/log/Logger'
  }

  constructor(logger, dispatcher) {
    this.$logger = logger
    this.$dispatcher = dispatcher
  }

  emergency(message, context) {
    this.writeLog('emergency', message, context)
  }

  alert(message, context) {
    this.writeLog('alert', message, context)
  }

  critical(message, context) {
    this.writeLog('critical', message, context)
  }

  error(message, context) {
    this.writeLog('error', message, context)
  }

  warning(message, context) {
    this.writeLog('warning', message, context)
  }

  notice(message, context) {
    this.writeLog('notice', message, context)
  }

  info(message, context) {
    this.writeLog('info', message, context)
  }

  debug(message, context) {
    this.writeLog('debug', message, context)
  }

  log(level, message, context) {
    this.writeLog(level, message, context)
  }

  write(level, message, context) {
    this.writeLog(level, message, context)
  }

  writeLog(level, message, context) {
    message = this.formatMessage(message)

    this.logger[level](message, context)

    this.fireLogEvent(level, message, context)
  }

  listen(callback) {
    if (!this.$dispatcher) {
      throw new Error('Events dispatcher has not been set.')
    }

    this.$dispatcher.listen(MessageLogged.class, callback)
  }

  fireLogEvent(level, message, context) {
    if (this.$dispatcher) {
      this.$dispatcher.dispatch(new MessageLogged(level, message, context))
    }
  }

  formatMessage(message) {
    return JSON.stringify(message)
  }

  getLogger() {
    return this.$logger
  }

  getEventDispatcher() {
    return this.$dispatcher
  }

  setEventDispatcher(dispatcher) {
    this.$dispatcher = dispatcher
  }

  $get(key) {
    return this.$logger[key]
  }
}
