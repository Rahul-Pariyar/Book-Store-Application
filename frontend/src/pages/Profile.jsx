import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { updateProfile } from "../services/api"; 

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // NEW state for edit mode
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setRole(user?.role);
  }, [user]);

  const handleUpdate = () => {

    console.log("User object:", user);

    const userId = user?._id || user?.id;

    if (!userId) {
      return toast.error("User not loaded yet");
    }
    updateProfile(userId, { name, email })
  .then((res) => {
    // update local state + localStorage
    const updatedUser = res.data.user;
    updateUser(updatedUser);  // from AuthContext

    toast.success("Profile updated successfully");
    setIsEditing(false);
  })
  .catch((err) => {
    console.log(err.response?.data || err.message);
    toast.error("Update failed");
  });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="flex flex-col gap-y-3">
        <div>
          <label className="block font-medium">Username</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            disabled={!isEditing} // <-- disable when not editing
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
            disabled={!isEditing} // <-- disable when not editing
          />
        </div>

        <div>
          <label className="block font-medium">Role</label>
          <input
            value={role}
            disabled
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />
        </div>

        <div className="w-full flex justify-end">
          {/* If not editing show Edit button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Edit Profile
            </button>
          ) : (
            // If editing show Save button
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
