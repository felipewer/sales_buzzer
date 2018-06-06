const plugin = require('preact-cli-sw-precache');

export default function (config) {
  const precacheConfig = {
    navigateFallbackWhitelist: [/^(?!\/auth\/)/]
  };
  return plugin(config, precacheConfig);
}