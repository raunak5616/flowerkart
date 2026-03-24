import express from "express";
import { upload } from "../middleware/upload.js";
import { createProduct } from "../controllers/productControllers.js";
import { Login, Signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);
router.post("/signup",upload.single("images"), Signup);
router.post("/login", Login);

export default router;
