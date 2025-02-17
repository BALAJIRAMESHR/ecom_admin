const path = require('path');

module.exports = function override(config, env) {
  // Add image file loader
  config.module.rules.push({
    test: /\.(jpg|jpeg|png|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: '/images/',
        },
      },
    ],
  });

  // Resolve asset imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@assets': path.resolve(__dirname, 'src/assets'),
  };

  return config;
}; 