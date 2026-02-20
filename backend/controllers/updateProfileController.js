import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const updateUserProfile = AsyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const profile = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true, runValidators: true },
  );

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  res.json({ message: "Profile updated successfully!", user: profile });
});
