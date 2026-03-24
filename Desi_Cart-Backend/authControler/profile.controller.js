import UserProfile from "../mongodb/models/userProfilemodel.js";
import User from "../mongodb/models/userModel.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const userId = req.user.id;
    const updateData = { name, email, phone, address };

    if (req.file) {
      updateData.images = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedUser = await UserProfile.findOneAndUpdate(
      { userId: userId },
      updateData,
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      data: updatedUser
    });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 add this for debugging
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const profile = await UserProfile.findOne({ userId: userId });

    if (!profile) {
      const basicUser = await User.findById(userId);
      if (!basicUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        name: basicUser.name,
        email: basicUser.email,
        phone: basicUser.phone,
        address: ""
      });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};