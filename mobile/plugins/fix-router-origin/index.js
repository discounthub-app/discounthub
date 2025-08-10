/**
 * Local Expo config plugin: set a valid extra.router.origin
 * so @expo/cli CORS middleware can parse it without throwing.
 */
module.exports = function withFixRouterOrigin(config) {
  const port = process.env.RCT_METRO_PORT || '8081';
  const origin = `http://localhost:${port}`;

  config.extra ||= {};
  const current = config.extra.router || {};
  config.extra.router = { ...current, origin };

  return config;
};
