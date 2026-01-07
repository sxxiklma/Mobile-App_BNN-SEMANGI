const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for Supabase and Firebase
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Ignore warnings for these modules
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
