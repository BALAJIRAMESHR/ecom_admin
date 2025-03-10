const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/upload',
    createProxyMiddleware({
      target: 'http://103.120.176.156:5191',
      changeOrigin: true,
    })
  );
};