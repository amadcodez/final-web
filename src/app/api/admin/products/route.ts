import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    

    // 1️⃣ Connect to correct DBs
    const itemDB = client.db("MultiStore"); // item_record is here
    const storeDB = client.db("myDBClass");// store_record is here

    // 2️⃣ Fetch all products
    const items = await itemDB.collection("item_record").find({}).toArray();

    // 3️⃣ Extract unique storeIDs from products
    const storeIDs = Array.from(new Set(items.map(item => item.storeID?.trim())));

    // 4️⃣ Fetch matching stores
    const stores = await storeDB.collection("store_record").find({}).toArray();



    // 5️⃣ Build storeID → storeName map
    const storeMap = stores.reduce((acc, store) => {
      if (store.storeID && store.storeName) {
        acc[store.storeID.trim()] = store.storeName;
      }
      return acc;
    }, {} as Record<string, string>);

    // 6️⃣ Combine into enriched product array
    const enrichedItems = items.map(item => ({
      ...item,
      vendorName: storeMap[item.storeID?.trim()] || "Unknown Vendor"
    }));

    return NextResponse.json(enrichedItems);
  } catch (err) {
    console.error("Vendor name merge failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
