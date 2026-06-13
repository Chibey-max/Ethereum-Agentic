const path = require('path');
const fs = require('fs');

// Root-level node_modules has the compatible versions of ox/porto/viem
const rootNodeModules = path.resolve(__dirname, '..', 'node_modules');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['viem'],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Alias every ox/X sub-path to root node_modules/ox CJS files.
    // dashboard/node_modules/ox@0.6.9 is too old (missing ./erc8010 etc) and shadows the
    // root ox@0.14.25 because of resolve.modules order. We explicitly redirect each sub-path.
    const rootOxPkgPath = path.join(rootNodeModules, 'ox', 'package.json');
    const oxAliases = {};
    if (fs.existsSync(rootOxPkgPath)) {
      const rootOxPkg = JSON.parse(fs.readFileSync(rootOxPkgPath, 'utf8'));
      for (const [key, val] of Object.entries(rootOxPkg.exports || {})) {
        if (!key.startsWith('./') || key === '.') continue;
        const sub = key.slice(2);
        const cjsRel = (typeof val === 'object') ? (val.default || val.require) : null;
        if (cjsRel) {
          oxAliases['ox/' + sub] = path.join(rootNodeModules, 'ox', cjsRel.replace(/^\.\//, ''));
        }
      }
    }

    // Augment @wagmi/core/query with the two missing *SyncMutationOptions functions.
    // wagmi@2.19.5 references them but @wagmi/core@2.21.2 doesn't export them.
    // We alias the sub-path to a stub that re-exports the real module + adds the missing fns.
    const wagmiCoreQueryStub = path.join(__dirname, 'stubs', 'wagmi-core-query.js');

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Redirect all ox/X sub-paths to root ox@0.14.25 CJS files (see oxAliases above)
      ...oxAliases,
      '@react-native-async-storage/async-storage': false,
      // Stub out optional Safe/Porto wagmi connectors.
      // @safe-global packages import viem → ox/erc8010 which is missing in ox@0.6.9.
      // porto package imports ox/erc8010/SignatureErc8010 also missing in ox@0.6.9.
      // Neither connector is used by this app so stubbing them is safe.
      '@safe-global/safe-apps-provider': false,
      '@safe-global/safe-apps-sdk': false,
      // porto (and its sub-paths) imports ox/erc8010 and zod/mini — both unavailable.
      'porto': false,
      'porto/internal': false,
      'porto/wagmi': false,
      'porto/wagmi/Connector': false,
      // zod/mini shim (porto re-exports `z from 'zod/mini'` which zod v3 lacks)
      'zod/mini': require.resolve('zod'),
      // Redirect @wagmi/core/query to stub that adds missing *SyncMutationOptions exports
      '@wagmi/core/query': wagmiCoreQueryStub,
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      'pino-pretty': false,
    };
    // Allow files outside dashboard/ (e.g. mantle/) to resolve packages
    // from dashboard/node_modules.
    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      'node_modules',
    ];
    return config;
  },
};

module.exports = nextConfig;
