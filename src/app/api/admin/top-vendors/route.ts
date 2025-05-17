import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("myDBClass");
    const orders = db.collection("orders");
    const stores = db.collection("store_record");

    const allOrders = await orders.find().toArray();

    // Count orders by storeID
    const storeOrderCount: Record<string, number> = {};

    allOrders.forEach((order) => {
      if (Array.isArray(order.cartItems)) {
        order.cartItems.forEach((item) => {
          const storeID = item.storeID;
          if (storeID) {
            storeOrderCount[storeID] = (storeOrderCount[storeID] || 0) + 1;
          }
        });
      }
    });

    // Convert to array
    const storeCounts = Object.entries(storeOrderCount)
      .map(([storeID, orders]) => ({ storeID, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5); // Top 5

    // Get store names
    const storeNames = await stores
      .find({ storeID: { $in: storeCounts.map((s) => s.storeID) } })
      .toArray();

    const result = storeCounts.map((s) => {
      const store = storeNames.find((st) => st.storeID === s.storeID);
      return {
        name: store?.storeName || s.storeID,
        orders: s.orders,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("🔥 TOP VENDORS ERROR:", err);
    return NextResponse.json({ error: "Failed to load top vendors" }, { status: 500 });
  }
}
