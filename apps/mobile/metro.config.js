const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '../..');
const rootModules = path.resolve(workspaceRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  rootModules,
];

// Ensure shared packages resolve these modules from a single location,
// preventing duplicate React instances.
config.resolver.extraNodeModules = {
  react: path.resolve(rootModules, 'react'),
  'react-native': path.resolve(rootModules, 'react-native'),
  'react-native-safe-area-context': path.resolve(rootModules, 'react-native-safe-area-context'),
  '@react-navigation/native': path.resolve(rootModules, '@react-navigation/native'),
};

module.exports = config;
