import {
  registerUser,
  loginUser,
  verifyRegistrationOtp
} from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        ...result
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await verifyRegistrationOtp(req.body);

    res.status(200).json({
      success: true,
      message: "Account verification successful",
      data: result
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

export default {
  register,
  verifyOtp,
  login
};