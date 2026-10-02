import express from "express";
import cors from "cors";
import accountRoutes from "./Routes/accountRoute.js";
import authRoutes from "./Routes/authRoute.js";
import errorMiddleware from "./Middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

app.get("/api/v1/status", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.use(errorMiddleware);

export default app;
