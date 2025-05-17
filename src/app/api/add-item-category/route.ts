import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userID, itemType, storeID } = body;

    console.log("📥 Received body:", body);

    // ✅ Validate required fields
    if (!userID || !itemType || !storeID) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("myDBClass");

    // ✅ Insert into store_item_category
    const result = await db.collection("store_item_category").insertOne({
      userID,
      storeID,
      itemType,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Item category added!", id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
