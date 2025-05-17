import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const storeID = url.searchParams.get("storeID");

  if (!storeID) {
    return NextResponse.json({ message: "Store ID is required." }, { status: 400 });
  }

  try {
    await connectToDB();
    const items = await Item.find({ storeID });

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items found for this store." }, { status: 404 });
    }

    return NextResponse.json({ items }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred while fetching items." },
      { status: 500 }
    );
  }
}
