import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};
