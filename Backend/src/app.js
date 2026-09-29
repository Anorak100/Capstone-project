import express from "express";
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
