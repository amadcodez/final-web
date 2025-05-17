import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;

    // Databases
    const itemDB = client.db('MultiStore');       // where item_record is
    const storeDB = client.db('myDBClass');       // where store_record is

    // 1. Get all products
    const items = await itemDB.collection('item_record').find({}).toArray();

    // 2. Extract all unique storeIDs
    const rawIDs = items.map(item => item.storeID?.trim()).filter(Boolean);
const storeIDs = Array.from(new Set(rawIDs));

    

    // 3. Fetch matching store documents
    const stores = await storeDB.collection('store_record').find({
      storeID: { $in: storeIDs }
    }).toArray();

    // 4. Build map of storeID -> storeName
    const storeMap: Record<string, string> = {};
    for (const store of stores) {
      if (store.storeID && store.storeName) {
        storeMap[store.storeID.trim()] = store.storeName.trim();
      }
    }

    // 5. Count by vendorName (storeName)
    const vendorMap: Record<string, number> = {};
    let inStock = 0;
    let outOfStock = 0;

    for (const item of items) {
      const vendor = storeMap[item.storeID?.trim()] || 'Unknown';
      vendorMap[vendor] = (vendorMap[vendor] || 0) + 1;

      if (item.quantity > 0) inStock++;
      else outOfStock++;
    }

    const byVendor = Object.entries(vendorMap).map(([vendorName, count]) => ({
      vendorName,
      count,
    }));

    const byStock = [
      { label: 'In Stock', value: inStock },
      { label: 'Out of Stock', value: outOfStock },
    ];

    return NextResponse.json({ byVendor, byStock });
  } catch (err) {
    console.error('Chart API Error:', err);
    return NextResponse.json({ error: 'Failed to load chart' }, { status: 500 });
  }
}
