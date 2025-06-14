import express from "express";
import { getPin, getPins, createPin, interactionCheck, interact, getSavedPins } from "../controllers/pinController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/", getPins);
router.get("/:id", getPin);

router.post("/",verifyToken ,createPin);

router.get("/interaction-check/:id" ,interactionCheck);
router.post("/interact/:id", verifyToken, interact);

// 
router.get("/saved/:id", getSavedPins);


export default router;
