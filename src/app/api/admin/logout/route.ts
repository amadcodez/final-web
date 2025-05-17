import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });

  // ✅ This is the secret sauce
  response.cookies.set({
    name: "admin-auth",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "strict"
  });

  return response;
}
