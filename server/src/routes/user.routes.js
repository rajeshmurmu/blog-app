import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getPostsByUserController } from "../controllers/user.controllers.js";

const router = express.Router();

// get posts by user
router.route("/posts").get(authenticate, getPostsByUserController);

export default router;
