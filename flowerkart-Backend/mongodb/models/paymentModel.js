import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  amount: Number,
  deliveryAddress: { type: String },
  coordinates: { lat: Number, lng: Number },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  status: { type: String, default: "Pending" },
  isReviewed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
