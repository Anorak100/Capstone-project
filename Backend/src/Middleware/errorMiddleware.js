const errorMiddleware = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	const statusCode = error.statusCode || (error.type === "entity.parse.failed" ? 400 : 500);
	const message = statusCode === 500 ? "Internal server error" : error.message;

	res.status(statusCode).json({
		success: false,
		message
	});
};

export default errorMiddleware;