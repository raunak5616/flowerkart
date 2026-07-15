import mongoose from "mongoose";
import productModel from "../mongodb/models/productModel.js"
import user from "../mongodb/models/shop.model.js";

export const getProducts = async (req,res) =>{
    const requestStart = performance.now();

    try {
        console.log("🚀 GET PRODUCTS HIT");

        const queryStart = performance.now();
        const product = await productModel.find();
        const queryMs = performance.now() - queryStart;

        const serializationStart = performance.now();
        const payload = JSON.stringify(product);
        const serializationMs = performance.now() - serializationStart;
        const payloadBytes = Buffer.byteLength(payload);
        const totalMs = performance.now() - requestStart;

        console.log(
            `[PERF] /api/auth/products -> query=${queryMs.toFixed(2)} ms, serialization=${serializationMs.toFixed(2)} ms, payload=${payloadBytes} bytes, total=${totalMs.toFixed(2)} ms`
        );

        res.setHeader("Content-Type", "application/json");
        res.setHeader("X-Query-Time-Ms", queryMs.toFixed(2));
        res.setHeader("X-Serialization-Time-Ms", serializationMs.toFixed(2));
        res.setHeader("X-Payload-Bytes", String(payloadBytes));
        res.setHeader("X-Total-Time-Ms", totalMs.toFixed(2));
        res.status(200).send(payload);
    } catch (error) {
        console.log(
            `[PERF] /api/auth/products failed after ${(performance.now() - requestStart).toFixed(2)} ms`
        );
        console.log("🔥 GET PRODUCTS ERROR 🔥", error)
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
            stack: error.stack,
        });
    }
}

export const getShop = async (req,res) =>{
    try {
        console.log("🚀 GET SHOP HIT")  ;
        const shop = await user.find({ category: "shop" });
        res.status(200).json(shop);
    } catch (error) {
        console.log("🔥 GET SHOP ERROR 🔥", error)
        res.status(500).json({
            message: "Failed to fetch shop",
            error: error.message,
            stack: error.stack,
        });
    }
}

export const getProductsByShopId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🚀 GET PRODUCTS BY SHOP ID REQUESTED:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("❌ INVALID SHOP ID:", id);
            return res.status(400).json({ message: "Invalid shop ID" });
        }

        const products = await productModel.find({
            shopId: new mongoose.Types.ObjectId(id)
        });
        
        console.log(`✅ FOUND ${products.length} PRODUCTS FOR SHOP:`, id);
        res.status(200).json(products);

    } catch (error) {
        console.log("🔥 GET PRODUCTS BY SHOP ERROR 🔥", error);
        res.status(500).json({
            message: "Failed to fetch shop products",
            error: error.message
        });
    }
};
