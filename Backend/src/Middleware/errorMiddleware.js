const errorMiddleware = (error, _req, res, _next) => {
	const statusCode = error.statusCode ?? 500;

	res.status(statusCode).json({
		success: false,
		message: statusCode === 500 ? "An unexpected error occurred" : error.message
	});
};

export default errorMiddleware;