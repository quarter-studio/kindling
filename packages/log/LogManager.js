const {
  Logger: Monolog,
  handler: { StreamHandler, WhatFailureGroupHandler },
  formatter: { LineFormatter },
} = require('monolog')
const Logger = require('@kindling/log/Logger')
const Arr = require('@kindling/support/Arr')
const Obj = require('@kindling/support/Str')
const Str = require('@kindling/support/Str')

class LogManager {
  static get class() {
    return '@kindling/log/LogManager'
  }

  constructor(app) {
    this.$app = app
    this.$channels = {}
    this.$customCreators = {}
    this.$dateFormat = 'Y-m-d H:i:s'
    this.$levels = {
      debug: Monolog.DEBUG,
      info: Monolog.INFO,
      notice: Monolog.NOTICE,
      warning: Monolog.WARNING,
      error: Monolog.ERROR,
      critical: Monolog.CRITICAL,
      alert: Monolog.ALERT,
      emergency: Monolog.EMERGENCY,
    }
  }

  level(config) {
    const level = config.level || 'debug'

    if (level in this.$levels) {
      return this.$levels[level]
    }

    throw new Error('Invalid log level.')
  }

  stack(channels, channel) {
    return new Logger(
      this.createStackDriver({ channels, channel }),
      this.$app.make('events')
    )
  }

  channel(channel) {
    return this.driver(channel)
  }

  driver(driver) {
    return this.get(driver || this.getDefaultDriver())
  }

  getChannels() {
    return this.$channels
  }

  get(name) {
    try {
      return (
        this.$channels[name] ||
        onto(this.resolve(name), logger => {
          logger = new Logger(logger, this.$app.make('events'))

          return (this.$channels[name] = this.tap(name, logger))
        })
      )
    } catch (error) {
      return tap(this.createEmergencyLogger(), logger => {
        logger.emergency(
          'Unable to create configured logger. Using emergency logger.',
          { error }
        )
      })
    }
  }

  tap(name, logger) {
    Arr.walk(this.configurationFor(name).taps, tap => {
      const [binding, args] = this.parseTap(tap)

      // this.$app->make($binding)->__invoke($logger, ...explode(',', $args));
    })

    return logger
  }

  parseTap(tap) {
    return Str.contains(tap, ':') ? Str.explode(tap, ':', 2) : [tap, '']
  }

  createEmergencyLogger() {
    const config = this.configurationFor('emergency')
    const level = this.level({ level: 'debug' })
    const path = config.path || this.$app.storagePath('logs', 'kindling.log')

    const stream = new StreamHandler(path, level)
    const handler = this.prepareHandler(stream)

    const logger = new Monolog('kindling', [handler])
    const dispatcher = this.$app.make('events')

    return new Logger(logger, dispatcher)
  }

  resolve(name) {
    const config = this.configurationFor(name)

    if (!config) {
      throw new Error(`Log [${name}] is not defined.`)
    }

    if (config.driver in this.$customCreators) {
      return this.callCustomCreator(config)
    }

    const method = 'create' + Str.ucfirst(config.driver) + 'Driver'

    if (method in this) {
      return this[method](config)
    }

    throw new Error(`Driver [${config.driver}] is not supported.`)
  }

  callCustomCreator(config) {
    return this.$customCreators[config.driver](this.$app, config)
  }

  createCustomDriver(config) {
    const via = config.via

    const factory = is_closure(via) ? via : this.$app.make(via)

    return factory(config)
  }

  createStackDriver(config) {
    const handlers = Arr.flatMap(config.channels, channel => {
      return this.channel(channel).getHandlers()
    })

    if (config.ignore_exceptions) {
      // $handlers = [new WhatFailureGroupHandler($handlers)];
    }

    return new Monolog(this.parseChannel(config), handlers)
  }

  createSingleDriver(config) {
    const handler = new StreamHandler(
      config.path,
      this.level(config),
      Obj.get(config, 'bubble', true),
      Obj.get(config, 'permission', null),
      Obj.get(config, 'locking', false)
    )

    return new Monolog(
      this.parseChannel(config),
      this.prepareHandlers([handler], config)
    )
  }

  prepareHandlers(handlers, config) {
    return Arr.map(handlers, handler => {
      return this.prepareHandler(handler, config)
    })
  }

  prepareHandler(handler, config = {}) {
    if (!config.formatter) {
      handler.setFormatter(this.formatter())
    } else if (config.formatter !== 'default') {
      handler.setFormatter(
        this.$app.makeWith(config.formatter, config.formatter_with || {})
      )
    }

    return handler
  }

  formatter() {
    return tap(
      new LineFormatter(null, this.$dateFormat, true, true),
      formatter => {
        formatter.includeStacktraces()
      }
    )
  }

  parseChannel(config) {
    return config.name || this.getFallbackChannelName()
  }

  getFallbackChannelName() {
    return this.$app.bound('env') ? this.$app.environment() : 'production'
  }

  configurationFor(name) {
    return this.$app.make('config').get('logging.channels.' + name)
  }

  getDefaultDriver() {
    return this.$app.make('config').get('logging.default')
  }

  setDefaultDriver(name) {
    this.$app.make('config').set('logging.default', name)
  }

  extend(driver, callback) {
    this.$customCreators[driver] = callback.bind(this, this)

    return this
  }

  forgetChannel(driver) {
    driver = driver || this.getDefaultDriver()

    if (driver in this.$channels) {
      delete this.$channels[driver]
    }
  }

  $get(key) {
    return this.driver()[key]
  }
}

module.exports = proxy(LogManager, {
  construct(target, args) {
    return proxy(Reflect.construct(target, args))
  },
})
