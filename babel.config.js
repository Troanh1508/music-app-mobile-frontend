module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add plugins here if needed, for example:
      ['module-resolver', 
        {
            root: ['./'],
            alias: { 
                '@': './',
                'components': './components',
                'assets': './assets',
                'store': './store',
                'constants': './constants',
                'hooks': './hooks',
                
            } 
        }
    ]
    ],
  };
};