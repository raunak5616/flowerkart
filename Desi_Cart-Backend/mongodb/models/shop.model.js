import mongoose from "mongoose";

const signupModel = mongoose.Schema({
    name: { type: String, required: true },
    category:{type: String, required: true },
    shop: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    images: {
  url: String,
  public_id: String
}
});
const user = mongoose.model("User",signupModel);

export default user;