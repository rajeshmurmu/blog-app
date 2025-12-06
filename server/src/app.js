import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Blog App API");
});

// api routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRoutes);

// post routes
import postRoutes from "./routes/post.routes.js";
app.use("/api/v1/posts", postRoutes);

// user routes
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
  next();
});

export default app;
