export const generateAccountNumber = (phone) => {
	const digits = String(phone).replace(/\D/g, "");

	if (digits.length < 10) {
		throw new Error(
			"A valid phone number is required to generate an account number",
		);
	}

	return digits.slice(-10);
};