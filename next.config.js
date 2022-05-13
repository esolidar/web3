/** @type {import('next').NextConfig} */
const path = require('path');
const withTM = require('next-transpile-modules')(['@esolidar/toolkit']);
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const getProcessEnvVars = () => {
  const envs = {};

  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) envs[key] = process.env[key];
  });

  return envs;
};

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
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(getProcessEnvVars()),
        })
      );
    }
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
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
});

module.exports = withPWA(moduleExports);
