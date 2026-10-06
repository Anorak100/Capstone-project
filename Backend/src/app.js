import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./Routes/authRoute.js";
import accountRoutes from "./Routes/accountRoute.js";
import adminRoutes from "./Routes/adminRoute.js";
import transactionRoute from "./Routes/transactionRoute.js";
import errorMiddleware from "./Middleware/errorMiddleware.js";

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
const allowedOrigins = new Set([
  "https://fhast-pay.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.FRONTEND_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
]);

app.use(
  cors({
    origin(origin, callback) {
      return callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/transactions", transactionRoute);
app.use("/api/v1/transactions", transactionRoute);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.get("/api/v1/status", (_req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use(errorMiddleware);

export default app;
