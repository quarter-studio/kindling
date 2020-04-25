class ServiceProvider {
  static get class() {
    return '@kindling/support/ServiceProvider'
  }

  constructor(app) {
    this.app = app
  }

  register() {
    //
  }

  boot() {
    //
  }

  commands(commands) {
    // $commands = is_array($commands) ? $commands : func_get_args();
    //
    // Artisan::starting(function ($artisan) use ($commands) {
    //     $artisan->resolveCommands($commands);
    // });
  }
}

module.exports = ServiceProvider
