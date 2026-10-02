import {
  registerUser,
  loginUser,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: user.verificationEmailSent
        ? "Verification code sent"
        : "Registration saved, but the verification email could not be sent. Request a new code to continue.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    await resendRegistrationOtp(req.body.email);

    res.status(200).json({
      success: true,
      message: "If the account is pending, a new verification code has been sent",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRegistration = async (req, res, next) => {
  try {
    const result = await verifyRegistrationOtp(req.body);

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  resendVerification,
  verifyRegistration,
};
