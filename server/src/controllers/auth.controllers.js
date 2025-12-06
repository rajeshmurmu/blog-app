import { ZodError } from "zod";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../utils/auth.schema.js";
import config, { cookieOptions } from "../config/conf.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      password = "",
      confirmPassword = "",
    } = req.body;

    // zod validation
    const validate = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validate.success || validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validate.data.password, salt);

    // create user
    const user = await User.create({
      name: validate.data.name,
      email: validate.data.email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ user, message: "User Register Successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({ error: error.message });
    }
    throw new Error(error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;

    // zod validation
    const validate = loginSchema.safeParse({
      email,
      password,
    });

    if (!validate.success || validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(validate.data.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    // refresh token
    const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    user.password = undefined;
    user.refreshToken = undefined;

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        message: "User Logged In Successfully",
        accessToken,
        refreshToken,
        user,
      });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({ error: error.message });
    }
    throw new Error(error);
  }
};

export const logoutController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    // Find user with the given refresh token
    const dbUser = await User.findById(user.id);

    if (!dbUser) {
      return res.status(400).json({ error: "Invalid credentails" });
    }

    // Clear refresh token from database
    user.refreshToken = null;
    await dbUser.save();

    // Clear cookies
    if (req.cookies) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    throw new Error(error);
  }
};
