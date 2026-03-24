import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./mongodb/connection/connection.js";
import auth from "./router/index.js";
import razorpay from "./utils/razorpay.js";
import crypto from "crypto";
import Order from "./mongodb/models/paymentModel.js";
import UserData from "./mongodb/models/userDataModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use("/api/auth", auth)
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, userId, cartItems } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    const newOrder = new Order({
      userId,
      items: cartItems,
      amount,
      razorpay_order_id: order.id,
      status: "Pending"
    });
    await newOrder.save();

    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-payment-status", async (req, res) => {
  try {
    const { razorpay_order_id, status } = req.body;
    await Order.findOneAndUpdate({ razorpay_order_id }, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const existingOrder = await Order.findOne({ razorpay_order_id });
    if (existingOrder) {
      existingOrder.razorpay_payment_id = razorpay_payment_id;
      existingOrder.razorpay_signature = razorpay_signature;
      existingOrder.status = isAuthentic ? "Success" : "Failed";
      await existingOrder.save();
    }

    if (isAuthentic) {
      res.json({ success: true, message: "Payment verified", order: existingOrder });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature", order: existingOrder });
    }
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Sync Cart & Favorites
app.get("/user-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let userData = await UserData.findOne({ userId });
    
    if (!userData) {
      userData = await UserData.create({ userId, cart: [], favourite: [] });
    }
    
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/user-data/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart, favourite } = req.body;
    
    const updatedData = await UserData.findOneAndUpdate(
      { userId },
      { cart, favourite },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: updatedData });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync user data" });
  }
});



/* server */
async function startServer() {
  try {
    await connectDB();
    console.log("Connected to DB:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error in starting server:", error);
  }
}

startServer();
