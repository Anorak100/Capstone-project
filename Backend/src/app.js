import express from "express";
import authRoute from "./Routes/authRoute.js";
import errorMiddleware from "./Middleware/errorMiddleware.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/auth", authRoute);
app.use(errorMiddleware);
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export default app;
