import User from "../models/User.js";

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const profile = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile updated successfully!",user: profile });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
