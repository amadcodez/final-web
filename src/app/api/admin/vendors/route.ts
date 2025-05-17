// /api/admin/vendors/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    // Connect to both databases
    const dbMain = client.db("myDBClass");
    const dbItems = client.db("MultiStore");

    const userCollection = dbMain.collection("myCollectionMyDBClass");
    const storeCollection = dbMain.collection("store_record");
    const itemCollection = dbItems.collection("item_record");
    const ordersCollection = dbMain.collection("orders");

    // Step 1: Get all stores
    const stores = await storeCollection.find({}).toArray();

    // Step 2: Map stores to full vendor info
    const vendorsData = await Promise.all(
      stores.map(async (store) => {
        const vendor = await userCollection.findOne(
          { userID: store.userID },
          { projection: { password: 0 } }
        );

        if (!vendor) return null;

        const itemCount = await itemCollection.countDocuments({ storeID: store.storeID });
        const orderCount = await ordersCollection.countDocuments({ "cartItems.storeID": store.storeID });

        return {
          vendorID: vendor.userID,
          name: `${vendor.firstName} ${vendor.lastName || ""}`.trim(),
          email: vendor.email,
          contact: vendor.contact || "Not provided",
          storeName: store.storeName || "No name",
          location: store.location || "N/A",
          itemCount,
          orderCount,
          createdAt: store.createdAt || vendor.createdAt || null,
        };
      })
    );

    // Filter out nulls (in case store has no valid user)
    const filtered = vendorsData.filter(Boolean);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
    return NextResponse.json({ error: "Failed to fetch vendor data" }, { status: 500 });
  }
}
