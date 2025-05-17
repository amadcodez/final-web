"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,10}$/;

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [storeExists, setStoreExists] = useState(false);
  const router = useRouter();

  const checkExistingStore = async (userID: string) => {
    const response = await fetch(`/api/check-existing-store?userID=${userID}`);
    const data = await response.json();
    setStoreExists(data.exists);
    localStorage.setItem("storeID", data.storeID);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("You must be logged in to access this page.");
        router.push("/Login");
        return;
      }

      try {
        const response = await fetch(`/api/profile?email=${email}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load profile data.");
        } else {
          checkExistingStore(data.userID);
          setUserData(data);
          setUpdatedData(data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("An unexpected error occurred while fetching profile data.");
      }
    };
    fetchUserData();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setUpdatedData({ ...updatedData, [field]: value });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedData({ ...updatedData, profilePicture: reader.result as string });
      setProfilePicturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (updatedData.password && updatedData.password.length > 0) {
      if (userData?.password && updatedData.password === userData.password) {
        alert("You typed the same old password. Please choose a new password.");
        return;
      }
      if (!passwordRegex.test(updatedData.password)) {
        alert("Password must be 6–10 chars, including letters, digits, and a special character.");
        return;
      }
    }

    try {
      const response = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update profile.");
        return;
      }
      if (updatedData.password) {
        alert("Password updated. Please log in again.");
        localStorage.clear();
        router.push("/Login");
      } else {
        alert("Profile updated successfully!");
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile data:", err);
      alert("An error occurred while saving profile data.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/Login");
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!userData) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#ffe2cc] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#ff6d00] mb-6">
          Welcome, {userData.firstName} {userData.lastName}
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            {userData.profilePicture && (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover shadow"
              />
            )}
            <p className="mt-4 text-gray-700 text-center"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-700 text-center">
              <strong>Contact:</strong> {userData.contactNumber || "Not provided"}
            </p>
          </div>

          <div className="w-full md:w-2/3">
            {isEditing ? (
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={updatedData.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={updatedData.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={updatedData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="p-2 border rounded w-full"
                />
                {profilePicturePreview && (
                  <img
                    src={profilePicturePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                )}
                <div className="flex gap-3 justify-end">
                  <button onClick={handleSave} className="bg-[#ff6d00] text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button onClick={() => setIsEditing(true)} className="bg-[#ff6d00] text-white px-4 py-2 rounded">
                  Edit Profile
                </button>
                {storeExists ? (
                  <button onClick={() => router.push("/store")} className="bg-[#ff7c1a] text-white px-4 py-2 rounded">
                    View Store
                  </button>
                ) : (
                  <button onClick={() => router.push("/CreatingStore")} className="bg-[#ff7c1a] text-white px-4 py-2 rounded">
                    Create Store
                  </button>
                )}
                <button onClick={handleLogout} className="bg-[#e65100] text-white px-4 py-2 rounded">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}