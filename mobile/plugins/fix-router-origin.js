/**
 * Local config plugin: ensures extra.router.{origin,headOrigin} are valid URLs
 * so CORS middleware in @expo/cli doesn't crash on "Invalid URL".
 * Applied only in development.
 */
module.exports = function fixRouterOrigin(config, { projectRoot } = {}) {
  const isDev =
    process.env.NODE_ENV !== 'production' &&
    process.env.EXPO_NO_DEV_SERVER !== '1';

  if (!isDev) return config;

  const ORIGIN =
    process.env.EXPO_DEV_SERVER_ORIGIN ||
    `http://localhost:${process.env.RCT_METRO_PORT || 8081}`;

  config.extra = config.extra || {};
  config.extra.router = {
    ...(config.extra.router || {}),
    origin: ORIGIN,
    headOrigin: ORIGIN,
  };

  return config;
};
