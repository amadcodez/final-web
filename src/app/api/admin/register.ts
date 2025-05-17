import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // Parse the request body to get admin details
    const { email, password, firstName, lastName } = await req.json();

    // Validate that all required fields are present
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("admin"); // Connect to 'admin' database
    const collection = db.collection("adminUsers"); // Use 'adminUsers' collection

    // Check if an admin with the same email already exists
    const existingAdmin = await collection.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 409 }
      );
    }

    // Hash the admin password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const result = await collection.insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    // Return success message if insertion was successful
    if (result.insertedId) {
      return NextResponse.json({ message: "Admin registered successfully" });
    } else {
      throw new Error("Failed to register admin");
    }
  } catch (error) {
    console.error("Error during admin registration:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
