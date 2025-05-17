// /api/delete-vendor.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(req: Request) {
  try {
    const { userID } = await req.json();
    const client = await clientPromise;

    // 1. DBs
    const myDB = client.db("myDBClass");
    const multiStoreDB = client.db("MultiStore");

    // 2. Collections
    const usersCol = myDB.collection("myCollectionMyDBClass");
    const storeCol = myDB.collection("store_record");
    const categoryCol = myDB.collection("store_item_category");
    const itemCol = multiStoreDB.collection("item_record");
    const ordersCol = myDB.collection("orders");

    // 3. Delete vendor profile
    await usersCol.deleteOne({ userID });

    // 4. Find store (if exists)
    const store = await storeCol.findOne({ userID });
    if (store) {
      const storeID = store.storeID;

      // 4a. Delete store
      await storeCol.deleteOne({ storeID });

      // 4b. Delete categories for store
      await categoryCol.deleteMany({ storeID });

      // 4c. Delete products for store
      await itemCol.deleteMany({ storeID });

      // 4d. Delete orders related to store
      await ordersCol.deleteMany({ "cartItems.storeID": storeID });
    }

    return NextResponse.json({ success: true, message: "Vendor and related data deleted." });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
