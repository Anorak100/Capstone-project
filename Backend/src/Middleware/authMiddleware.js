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