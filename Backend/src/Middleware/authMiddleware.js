import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
	const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({
			success: false,
			message: "Authentication is required"
		});
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { userId: payload.sub, role: payload.role };
		next();
	} catch {
		res.status(401).json({
			success: false,
			message: "Invalid or expired access token"
		});
	}
};

export default authenticate;
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    next(error);
  }
};

export default authMiddleware;
