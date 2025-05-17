import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const dbMain = client.db("myDBClass");
    const dbItems = client.db("MultiStore");

    const usersCol = dbMain.collection("myCollectionMyDBClass");
    const storesCol = dbMain.collection("store_record");
    const ordersCol = dbMain.collection("orders");
    const itemsCol = dbItems.collection("item_record");

    const stores = await storesCol.find().toArray();

    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        const user = await usersCol.findOne({ userID: store.userID });
        if (!user) return null;

        const productCount = await itemsCol.countDocuments({ storeID: store.storeID });

        const storeOrders = await ordersCol.find({ "cartItems.storeID": store.storeID }).toArray();
        const orderCount = storeOrders.length;

        // ✅ Safe totalRevenue calculation with fallback
        const totalRevenue = storeOrders.reduce((sum, order) => {
          const cartTotal = order.cartItems
            ?.filter((item: any) => item.storeID === store.storeID)
            .reduce((acc: number, item: any) => {
              const total = item.total ?? (item.price * item.quantity) ?? 0;
              return acc + total;
            }, 0) || 0;

          return sum + cartTotal;
        }, 0);

        return {
          storeID: store.storeID,
          storeName: store.storeName || "Unnamed Store",
          location: store.location || "N/A",
          vendorName: `${user.firstName} ${user.lastName || ""}`.trim(),
          email: user.email,
          productCount,
          orderCount,
          totalRevenue,
          createdAt: store.createdAt || new Date(),
        };
      })
    );

    const filtered = enrichedStores.filter(Boolean);
    return NextResponse.json(filtered);
  } catch (error) {
    console.error("❌ Error fetching stores:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
