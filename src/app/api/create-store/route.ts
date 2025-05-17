import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid"; // ✅ npm install uuid

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userID, storeName, itemType, numCategories, location } = body;

    const client = await clientPromise;
    const db = client.db("myDBClass");

    // ✅ Generate custom store ID using UUID
    const customStoreID = `store-${uuidv4()}`;

    // ✅ Insert into store_record collection
    await db.collection("store_record").insertOne({
      storeID: customStoreID,
      userID,
      storeName,
      itemType,
      numCategories: parseInt(numCategories, 10),
      location,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Store created successfully!",
      storeID: customStoreID,
    });
  } catch (error: any) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
