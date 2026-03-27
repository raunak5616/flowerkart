import mongoose from "mongoose";

const signupModel = mongoose.Schema({
    name: { type: String, required: true },
    shop: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "seller" },
    images: {
  url: String,
  public_id: String
}
}, {
    timestamps: true,
    collection: 'sellers'
});
const user = mongoose.model("User",signupModel);

export default user;