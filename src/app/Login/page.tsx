"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To hold the error message
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation to check if any field is empty
    if (!email || !password) {
      alert("Both email and password are required!");
      return;
    }

    try {
      // Send login request to the API
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Login successful!");

        // Save email and userType to localStorage for profile page
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userType", data.user.userType);

        // Redirect to Profile page
        router.push("/Profile"); // No query parameter is added
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <div className="screenMiddleDiv">
        <div className="formDiv">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center text-[#6f8d86] font-bold">Login</h2>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div>
              <label htmlFor="email" className="formLabel">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="my-6">
              <label htmlFor="password" className="formLabel">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="formButton hover:text-white font-semibold bg-[#6f8d86] hover:bg-[#5a726b] transition"
            >
              Login
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
