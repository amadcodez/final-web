import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myDBClass");

    const vendorsCount = await db.collection("myCollectionMyDBClass").countDocuments();
    const storesCount = await db.collection("store_record").countDocuments();
    const orders = await db.collection("orders").find({}).toArray();
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const outOfStockCount = await db.collection("item_record").countDocuments({ quantity: { $lte: 0 } });

    const categoryCount = await db.collection("store_item_category").countDocuments();

    return NextResponse.json({
      vendorsCount,
      storesCount,
      totalOrders,
      totalRevenue,
      outOfStockCount,
      categoryCount,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
