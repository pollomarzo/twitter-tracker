const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  const socketProxy = createProxyMiddleware('/socket', {
    target: 'http://localhost:4000',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
  });

  app.use(socketProxy);
};
