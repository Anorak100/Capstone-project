export const generateAccountNumber = (phone) => {
	const digits = String(phone).replace(/\D/g, "");

	if (digits.length < 10) {
		throw new Error(
			"A valid phone number is required to generate an account number",
		);
	}

	return digits.slice(-10);
};
import { randomInt } from "node:crypto";

const ACCOUNT_NUMBER_SUFFIX_LENGTH = 6;
const ACCOUNT_NUMBER_SUFFIX_RANGE = 10 ** ACCOUNT_NUMBER_SUFFIX_LENGTH;

export const generateAccountNumber = (phone) => {
	const phoneDigits = String(phone).replace(/\D/g, "");

	if (phoneDigits.length < 4) {
		throw new Error("A valid phone number is required to generate an account number");
	}

	const phoneSuffix = phoneDigits.slice(-4);
	const randomSuffix = randomInt(ACCOUNT_NUMBER_SUFFIX_RANGE)
		.toString()
		.padStart(ACCOUNT_NUMBER_SUFFIX_LENGTH, "0");

	return `${phoneSuffix}${randomSuffix}`;
};

export default generateAccountNumber;
