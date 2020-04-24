const Container = require('@kindling/container/Container')
const Arr = require('@kindling/support/Arr')
const Obj = require('@kindling/support/Obj')
const Str = require('@kindling/support/Str')

class Application extends Container {
  static get class() {
    return '@kindling/foundation/Application'
  }

  constructor(basePath) {
    super()

    this.$callbacks = {}
    this.$serviceProviders = []

    this.setBasePath(basePath)

    this.registerBaseBindings()
    this.registerBaseServiceProviders()
    this.registerCoreContainerAliases()
  }

  registerBaseBindings() {
    this.constructor.setInstance(this)

    this.instance('app', this)

    this.instance(Container.class, this)
  }

  registerBaseServiceProviders() {
    // this.register(new EventServiceProvider(this))
    // this.register(new LogServiceProvider(this))
    // this.register(new RoutingServiceProvider(this))
  }

  bootstrapWith(bootstrappers) {
    this.$hasBeenBootstrapped = true

    Arr.walk(bootstrappers, bootstrapper => {
      this.make('events').dispatch('bootstrapping: ' + bootstrapper, [this])

      this.make(bootstrapper).bootstrap(this)

      this.make('events').dispatch('bootstrapped: ' + bootstrapper, [this])
    })
  }

  afterLoadingEnvironment(callback) {
    return this.afterBootstrapping(LoadEnvironmentVariables.class, callback)
  }

  beforeBootstrapping(bootstrapper, callback) {
    this.make('events').listen('bootstrapping: ' + bootstrapper, callback)
  }

  afterBootstrapping(bootstrapper, callback) {
    this.make('events').listen('bootstrapped: ' + bootstrapper, callback)
  }

  hasBeenBootstrapped() {
    return this.$hasBeenBootstrapped
  }

  setBasePath(basePath) {
    this.$basePath = Str.rtrim(basePath, '/')

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
    return Str.path(this.$basePath, ...path)
  }

  path(...path) {
    if (this.$appPath) {
      return Str.path(this.$appPath, ...path)
    }

    return this.basePath('app', ...path)
  }

  useAppPath(path) {
    this.$appPath = path

    this.instance('path', path)

    return this
  }

  langPath(...path) {
    return this.resourcePath('lang', ...path)
  }

  configPath(...path) {
    return this.basePath('config', ...path)
  }

  storagePath(...path) {
    if (this.$storagePath) {
      return Str.path(this.$storagePath, ...path)
    }

    return this.basePath('storage', ...path)
  }

  useStoragePath(path) {
    this.$storagePath = path

    this.instance('path.storage', path)

    return this
  }

  resourcePath(...path) {
    return this.basePath('resources', ...path)
  }

  environmentPath() {
    return this.$environmentPath || this.$basePath
  }

  useEnvironmentPath(path) {
    this.$environmentPath = path

    return this
  }

  loadEnvironmentFrom(file) {
    this.$environmentFile = file

    return this
  }

  environmentFile() {
    return this.$environmentFile || '.env'
  }

  environmentFilePath() {
    return Str.path(this.environmentPath(), this.environmentFile())
  }

  environment(...environments) {
    const env = this.make('env')

    if (environments.length) {
      return Arr.exists(environments, env)
    }

    return env
  }

  isLocal() {
    return this.environment('local')
  }

  isProduction() {
    return this.environment('production')
  }

  detectEnvironment(callback) {
    // $args = $_SERVER['argv'] ?? null;

    // return this['env'] = (new EnvironmentDetector)->detect($callback, $args);

    this.instance('env', 'local')
  }

  runningUnitTests() {
    return this.environment('testing')
  }

  registerConfiguredProviders() {
    // $providers = Collection.make(this.config['app.providers'])
    //                 ->partition(function ($provider) {
    //                     return strpos($provider, 'Illuminate\\') === 0;
    //                 });
    // $providers->splice(1, 0, [this.make(PackageManifest.class)->providers()]);
    // (new ProviderRepository(this, new Filesystem, this.getCachedServicesPath()))
    //             ->load($providers->collapse()->toArray());
  }

  register(provider, force = false) {
    const registered = this.getProvider($provider)

    if (registered && !force) {
      return registered
    }

    if (Str.isString(provider)) {
      provider = this.resolveProvider(provider)
    }

    provider.register()

    Arr.walk(provider.bindings, (value, key) => {
      this.bind(key, value)
    })

    Arr.walk(provider.singletons, (value, key) => {
      this.singleton(key, value)
    })

    this.markAsRegistered(provider)

    if (this.isBooted()) {
      this.bootProvider(provider)
    }

    return provider
  }

  getProvider(provider) {
    return Arr.head(this.getProviders(provider))
  }

  getProviders(provider) {
    const Provider = Arr.isString(provider) ? require(provider) : provider

    return Arr.where(this.$serviceProviders, value => {
      return value instanceof Provider
    })
  }

  resolveProvider(provider) {
    const Provider = require(provider)

    return new Provider(this)
  }

  markAsRegistered(provider) {
    this.$serviceProviders.push(provider)
  }

  isBooted() {
    return this.$booted
  }

  boot() {
    if (this.isBooted()) {
      return
    }

    this.fireCallbacks(this.getCallbacks('booting'))

    Arr.walk(this.$serviceProviders, provider => {
      this.bootProvider(provider)
    })

    this.$booted = true

    this.fireCallbacks(this.getCallbacks('booted'))
  }

  getCallbacks(key) {
    return Obj.getOrSet(this.$callbacks, key, [])
  }

  bootProvider(provider) {
    return provider.boot && provider.boot()
  }

  booting(callback) {
    this.getCallbacks('booting').push(callback)
  }

  booted(callback) {
    this.getCallbacks('booted').push(callback)

    if (this.isBooted()) {
      this.fireCallbacks([callback])
    }
  }

  fireCallbacks(callbacks) {
    Arr.walk(callbacks, callback => {
      callback(this)
    })
  }

  abort(code, message = '', headers = {}) {
    // if ($code == 404) {
    //     throw new NotFoundHttpException($message);
    // }
    //
    // throw new HttpException($code, $message, null, $headers);
  }

  terminating(callback) {
    this.getCallbacks('terminating').push(callback)

    return this
  }

  terminate() {
    this.fireCallbacks(this.getCallbacks('terminating'))
  }

  provideFacades(namespace) {
    // AliasLoader.setFacadeNamespace($namespace);
  }

  getLocale() {
    return this.make('config').get('app.locale')
  }

  setLocale(locale) {
    this.make('config').set('app.locale', locale)

    // this.make('translator').setLocale(locale)

    // this.make('events').dispatch(new LocaleUpdated($locale));
  }

  isLocale(locale) {
    return this.getLocale() === locale
  }

  registerCoreContainerAliases() {
    const aliases = {
      app: [this.constructor.class],
    }

    Arr.walk(aliases, (aliases, abstract) => {
      Arr.walk(aliases, alias => {
        this.alias(abstract, alias)
      })
    })

    //     'app'                  => [self.class, \Illuminate\Contracts\Container\Container.class, \Illuminate\Contracts\Foundation\Application.class, \Psr\Container\ContainerInterface.class],
    //     'auth'                 => [\Illuminate\Auth\AuthManager.class, \Illuminate\Contracts\Auth\Factory.class],
    //     'auth.driver'          => [\Illuminate\Contracts\Auth\Guard.class],
    //     'blade.compiler'       => [\Illuminate\View\Compilers\BladeCompiler.class],
    //     'cache'                => [\Illuminate\Cache\CacheManager.class, \Illuminate\Contracts\Cache\Factory.class],
    //     'cache.store'          => [\Illuminate\Cache\Repository.class, \Illuminate\Contracts\Cache\Repository.class, \Psr\SimpleCache\CacheInterface.class],
    //     'cache.psr6'           => [\Symfony\Component\Cache\Adapter\Psr16Adapter.class, \Symfony\Component\Cache\Adapter\AdapterInterface.class, \Psr\Cache\CacheItemPoolInterface.class],
    //     'config'               => [\Illuminate\Config\Repository.class, \Illuminate\Contracts\Config\Repository.class],
    //     'cookie'               => [\Illuminate\Cookie\CookieJar.class, \Illuminate\Contracts\Cookie\Factory.class, \Illuminate\Contracts\Cookie\QueueingFactory.class],
    //     'encrypter'            => [\Illuminate\Encryption\Encrypter.class, \Illuminate\Contracts\Encryption\Encrypter.class],
    //     'db'                   => [\Illuminate\Database\DatabaseManager.class, \Illuminate\Database\ConnectionResolverInterface.class],
    //     'db.connection'        => [\Illuminate\Database\Connection.class, \Illuminate\Database\ConnectionInterface.class],
    //     'events'               => [\Illuminate\Events\Dispatcher.class, \Illuminate\Contracts\Events\Dispatcher.class],
    //     'files'                => [\Illuminate\Filesystem\Filesystem.class],
    //     'filesystem'           => [\Illuminate\Filesystem\FilesystemManager.class, \Illuminate\Contracts\Filesystem\Factory.class],
    //     'filesystem.disk'      => [\Illuminate\Contracts\Filesystem\Filesystem.class],
    //     'filesystem.cloud'     => [\Illuminate\Contracts\Filesystem\Cloud.class],
    //     'hash'                 => [\Illuminate\Hashing\HashManager.class],
    //     'hash.driver'          => [\Illuminate\Contracts\Hashing\Hasher.class],
    //     'translator'           => [\Illuminate\Translation\Translator.class, \Illuminate\Contracts\Translation\Translator.class],
    //     'log'                  => [\Illuminate\Log\LogManager.class, \Psr\Log\LoggerInterface.class],
    //     'mail.manager'         => [\Illuminate\Mail\MailManager.class, \Illuminate\Contracts\Mail\Factory.class],
    //     'mailer'               => [\Illuminate\Mail\Mailer.class, \Illuminate\Contracts\Mail\Mailer.class, \Illuminate\Contracts\Mail\MailQueue.class],
    //     'auth.password'        => [\Illuminate\Auth\Passwords\PasswordBrokerManager.class, \Illuminate\Contracts\Auth\PasswordBrokerFactory.class],
    //     'auth.password.broker' => [\Illuminate\Auth\Passwords\PasswordBroker.class, \Illuminate\Contracts\Auth\PasswordBroker.class],
    //     'queue'                => [\Illuminate\Queue\QueueManager.class, \Illuminate\Contracts\Queue\Factory.class, \Illuminate\Contracts\Queue\Monitor.class],
    //     'queue.connection'     => [\Illuminate\Contracts\Queue\Queue.class],
    //     'queue.failer'         => [\Illuminate\Queue\Failed\FailedJobProviderInterface.class],
    //     'redirect'             => [\Illuminate\Routing\Redirector.class],
    //     'redis'                => [\Illuminate\Redis\RedisManager.class, \Illuminate\Contracts\Redis\Factory.class],
    //     'redis.connection'     => [\Illuminate\Redis\Connections\Connection.class, \Illuminate\Contracts\Redis\Connection.class],
    //     'request'              => [\Illuminate\Http\Request.class, \Symfony\Component\HttpFoundation\Request.class],
    //     'router'               => [\Illuminate\Routing\Router.class, \Illuminate\Contracts\Routing\Registrar.class, \Illuminate\Contracts\Routing\BindingRegistrar.class],
    //     'session'              => [\Illuminate\Session\SessionManager.class],
    //     'session.store'        => [\Illuminate\Session\Store.class, \Illuminate\Contracts\Session\Session.class],
    //     'url'                  => [\Illuminate\Routing\UrlGenerator.class, \Illuminate\Contracts\Routing\UrlGenerator.class],
    //     'validator'            => [\Illuminate\Validation\Factory.class, \Illuminate\Contracts\Validation\Factory.class],
    //     'view'                 => [\Illuminate\View\Factory.class, \Illuminate\Contracts\View\Factory.class],
  }

  flush() {
    super.flush()

    this.$callbacks = {}
    this.$serviceProviders = []
  }
}

module.exports = Application
