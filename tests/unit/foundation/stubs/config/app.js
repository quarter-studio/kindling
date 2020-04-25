module.exports = {
  name: env('APP_NAME', 'Kindling'),

  env: env('APP_ENV', 'production'),

  debug: env('APP_DEBUG', false),

  url: env('APP_URL', 'http://localhost'),

  asset_url: env('ASSET_URL', null),

  timezone: 'UTC',

  locale: 'en',

  fallback_locale: 'en',

  faker_locale: 'en_US',

  providers: [
    //
  ],

  aliases: {
    //
  },
}
