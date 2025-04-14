const app = require("./server");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;

connectDB();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
