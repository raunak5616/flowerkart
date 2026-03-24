import { Login, signup } from "../authControler/auth.controller.js";
import express from "express";
import {getProducts, getProductsByShopId, getShop } from "../authControler/productController.js";
import { getProfile, updateProfile } from "../authControler/profile.controller.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/products", getProducts);
router.get("/profile/:id", verifyToken, getProfile);
router.get("/productsById/:id", getProductsByShopId);
router.get("/shop", getShop);
router.post("/signup",signup);
router.post("/login",Login);
router.post("/profileUpdate",verifyToken,upload.single("images"),updateProfile);

export default router;