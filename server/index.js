import "dotenv/config";
import app from "./src/app.js";
import config from "./src/config/conf.js";
import { connectDB } from "./src/config/db.config.js";

const PORT = config.port;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
