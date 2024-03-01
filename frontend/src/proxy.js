const cors_proxy = require("cors-anywhere");

const host = "localhost";
const port = 3000;

cors_proxy
  .createServer({
    originWhitelist: [],
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(port, host, () => {
    console.log(`CORS Anywhere server is running on ${host}:${port}`);
  });
