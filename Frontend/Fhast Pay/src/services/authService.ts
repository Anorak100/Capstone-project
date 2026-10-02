const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type RegistrationData = {
	user: {
		email: string;
		isActive: boolean;
	};
	verificationRequired: boolean;
	verificationEmailSent: boolean;
};

export type VerificationData = {
	user: {
		email: string;
		isActive: boolean;
	};
	account: {
		accountNumber: string;
		balance: string;
		currency: string;
		status: string;
	};
	onboarding: {
		status: string;
	};
};

const request = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
	const response = await fetch(`${API_URL}/auth/${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	const result = (await response.json()) as ApiResponse<T>;
	if (!response.ok || !result.success) {
		throw new Error(result.message || "The request could not be completed");
	}

	return result;
};

export const registerUser = (data: {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
}) => request<RegistrationData>("register", data);

export const verifyAccount = (data: { identifier: string; code: string }) =>
	request<VerificationData>("verify", data);

export const resendVerification = (email: string) =>
	request<undefined>("resend-verification", { email });
