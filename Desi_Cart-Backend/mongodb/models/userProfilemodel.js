import mongoose from "mongoose";

const userProfileModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
    unique: true
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  images: {
    url: String,
    public_id: String
  }
});

const UserProfile = mongoose.model("userProfile", userProfileModel);

export default UserProfile;