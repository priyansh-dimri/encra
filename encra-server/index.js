const app = require("./server");
const http = require("http");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const initSocketServer = require("./socket");

connectDB();

if (process.env.NODE_ENV !== "test") {
  const server = http.createServer(app);
  initSocketServer(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
