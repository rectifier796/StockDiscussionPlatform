import express from "express";
import { getUserDetails, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../helpers/multerSetup.helper.js";
import { checkAuth } from "../middleware/auth.middleware.js";


const userRoutes = express.Router();

userRoutes.get("/profile/:userId", getUserDetails);

userRoutes.put("/profile", checkAuth, upload.single("profilePicture"), updateProfile);

export default userRoutes;