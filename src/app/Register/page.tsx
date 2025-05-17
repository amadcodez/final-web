"use client";

import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact?: string;
  profilePicture?: string | null;
}

// 1) Helper to parse & validate phone (full international format only)
function isValidPhoneNumber(phone: string): boolean {
  const trimmed = phone.trim();
  const phoneNumber = parsePhoneNumberFromString(trimmed);
  return phoneNumber ? phoneNumber.isValid() : false;
}

// 2) Helper to sanitize user input
const sanitizeInput = (input: string): string => {
  const inputFilteredTrim = input.trim();
  return inputFilteredTrim
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\/g, "");
};

// 3) Email regex for common providers
const emailRegex = /^(\w+)([\.-]?\w+)*@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com)$/i;

// 4) Name regexes allow spaces & limit length
const firstNameRegex = /^[A-Za-z\s]{1,50}$/;
const lastNameRegex = /^[A-Za-z\s]{1,50}$/;

// 5) Password must be 6–10 chars, contain letters, digits, and special chars
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,10}$/;

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState("");

  // Handle profile picture uploads
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    // 1) Validate first name
    if (!firstNameRegex.test(firstName)) {
      setGeneralError("First Name must be 1–50 letters/spaces (no digits or symbols).");
      return;
    }

    // 2) Validate last name (optional)
    if (lastName.trim() && !lastNameRegex.test(lastName)) {
      setGeneralError("Last Name can only have letters/spaces (max 50 characters).");
      return;
    }

    // 3) Validate email format & allowed domains
    if (!emailRegex.test(email)) {
      setGeneralError(
        "Email must be from Gmail, Yahoo, Hotmail, Outlook, or Live (e.g., user@gmail.com)."
      );
      return;
    }

    // 4) Validate password with the new passwordRegex
    if (!passwordRegex.test(password)) {
      setGeneralError(
        "Password must be 6–10 characters long and include at least one letter, one digit, and one special character."
      );
      return;
    }

    // 5) Validate password match
    if (password !== confirmPassword) {
      setGeneralError("Passwords do not match!");
      return;
    }

    // 6) Validate contact (optional) - must be full international format if entered
    if (contact.trim()) {
      if (!isValidPhoneNumber(contact.trim())) {
        setGeneralError(
          "Please provide a valid phone number in full international format (e.g. +16466698002)."
        );
        return;
      }
    }

    // 7) Prepare data for submission
    const userData: UserData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: sanitizeInput(email),
      password, // typically hashed on the server
      contact: sanitizeInput(contact),
      profilePicture,
    };

    // 8) Submit to the server
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        setGeneralError(data.message || "Registration failed.");
        return;
      }

      // Store the custom userID in localStorage
      if (data.userID) {
        localStorage.setItem("userID", data.userID);
      }

      alert("Registration successful! Please check your email inbox for verification.");
setTimeout(() => {
  localStorage.setItem("userEmailForVerification", email);
  window.location.href = "/verify";
}, 1000);

    } catch (error) {
      console.error("Registration error:", error);
      setGeneralError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#d2e8e3]">
      <div className="w-full max-w-md bg-[#ecfbf4] p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl font-bold">Create Account</h2>

          {generalError && (
            <p className="text-red-500 text-xs text-center">{generalError}</p>
          )}

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Last Name (Optional)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Password (6-10 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <PasswordStrengthBar password={password} />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Contact (Optional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="w-full p-2"
          />
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover mx-auto"
            />
          )}

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded w-full"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/Login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
