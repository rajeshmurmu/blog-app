import e from "express";
import express from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/logout").get(authenticate, logoutController);

export default router;
