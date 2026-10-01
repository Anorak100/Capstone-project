import express from "express";
import authRoute from "./Routes/authRoute.js";
import errorMiddleware from "./Middleware/errorMiddleware.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/auth", authRoute);
app.use(errorMiddleware);

export default app;
