// app/api/verify-code/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, message: "Email and code are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const collection = db.collection("myCollectionMyDBClass");

    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, message: "Email already verified." }, { status: 409 });
    }

    if (!user.verifyCode || user.verifyCode !== code) {
      return NextResponse.json({ success: false, message: "Invalid verification code." }, { status: 401 });
    }

    if (user.verifyExpiresAt && new Date(user.verifyExpiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: "Verification code expired." }, { status: 410 });
    }

    await collection.updateOne(
      { email },
      {
        $set: { isVerified: true },
        $unset: { verifyCode: "", verifyExpiresAt: "" },
      }
    );

    return NextResponse.json({ success: true, message: "Email verified successfully!" });

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
