const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://crazy-trade-server.vercel.app", // Change this to your server URL
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api/v3",
      },
    })
  );
};
