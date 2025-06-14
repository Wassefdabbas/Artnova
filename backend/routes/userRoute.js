import express from "express";
import {getUser, loginUser, logoutUser, registerUser, followUser} from '../controllers/userController.js'
import {verifyToken} from "../middlewares/verifyToken.js"
const router = express.Router();

router.get("/:userName", getUser)

router.post("/auth/register", registerUser)
router.post("/auth/login", loginUser)
router.post("/auth/logout", logoutUser)

router.post("/follow/:userName", verifyToken, followUser)

export default router;
