cat > metro.config.js <<'JS'
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // На всякий случай добавим популярные расширения
  const exts = new Set(config.resolver.sourceExts || []);
  ['cjs', 'mjs', 'js', 'jsx', 'ts', 'tsx', 'json'].forEach(e => exts.add(e));
  config.resolver.sourceExts = Array.from(exts);

  // Явный алиас на хелпер Babel, из-за которого падает сборка
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    '@babel/runtime/helpers/interopRequireDefault':
      require.resolve('@babel/runtime/helpers/interopRequireDefault.js'),
  };

  return config;
})();
JS