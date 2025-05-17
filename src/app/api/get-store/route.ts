import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const storeID = req.nextUrl.searchParams.get("storeID");

  if (!storeID) {
    return NextResponse.json({ message: "Missing storeID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("myDBClass");

    const store = await db.collection("store_record").findOne({ storeID });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    console.error("GET store error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
