import express from "express";
import {login, registerUser } from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);

authRoutes.post("/login", login);

export default authRoutes;