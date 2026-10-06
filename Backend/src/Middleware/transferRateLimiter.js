import rateLimit from "express-rate-limit";

const transferRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    success: false,
    message: "Too many transfer attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default transferRateLimiter;
