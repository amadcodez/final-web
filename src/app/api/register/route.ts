// app/api/register/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

// Helper function to generate 6-digit alphanumeric code
function generateVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, contact, profilePicture } = body;

    if (profilePicture && !profilePicture.startsWith("data:image")) {
      return NextResponse.json(
        { success: false, message: "Invalid profile picture format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");

    const existingUser = await db.collection("myCollectionMyDBClass").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customUserId = uuidv4();
    const verifyCode = generateVerificationCode(); // ✅ New code generation
    const verifyExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

    const result = await db.collection("myCollectionMyDBClass").insertOne({
      userID: customUserId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contact,
      profilePicture,
      isVerified: false,
      verifyCode,          // ✅ Save the 6 digit code
      verifyExpiresAt,
      createdAt: new Date(),
    });

    // 📨 Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Your Store" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center;">
            <h2 style="color: #333; margin-bottom: 10px;">Verify Your Email Address</h2>
            <p style="color: #555; font-size: 15px; margin-bottom: 30px;">
              Thanks for signing up, <strong>${firstName}</strong>! <br/>
              Please use the code below to verify your email address.
            </p>
    
            <div style="display: inline-block; background: #fa4a00; color: white; padding: 15px 30px; font-size: 24px; border-radius: 6px; font-weight: bold; letter-spacing: 2px; margin-bottom: 30px;">
              ${verifyCode}
            </div>
    
            <p style="color: #999; font-size: 13px; margin-top: 20px;">
              This code will expire in 30 minutes. <br/>
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `
    });
    

    return NextResponse.json({
      success: true,
      userID: customUserId,
      message: "Registered successfully. Verification code sent via email.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
