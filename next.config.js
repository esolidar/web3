/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@esolidar/toolkit']);
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const moduleExports = withTM({
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  i18n: {
    locales: ['en', 'pt', 'br'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      readline: false,
    };
    return config;
  },
});

module.exports = withPWA(moduleExports);
