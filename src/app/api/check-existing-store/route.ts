export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const userID = req.nextUrl.searchParams.get("userID");

    if (!userID) {
      return NextResponse.json(
        { success: false, message: "Missing userID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myDBClass");

    const existingStore = await db.collection("store_record").findOne({ userID });

    const exists = !!existingStore;
    const storeID = existingStore?.storeID || null;

    return NextResponse.json({ success: true, exists, storeID });
  } catch (error: any) {
    console.error("Error checking userID:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
