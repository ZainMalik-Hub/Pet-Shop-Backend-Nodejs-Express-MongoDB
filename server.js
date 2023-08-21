const http = require("http");
// const PORT = process.env.PORT || 3001;
const PORT = 3001;

const app = require("./src/app");

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// module.exports = server;
