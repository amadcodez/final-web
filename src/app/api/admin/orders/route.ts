// /api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('myDBClass');

    // Fetch orders
    const orders = await db
      .collection('orders')
      .find({})
      .sort({ date: -1 })
      .toArray();

    // ✅ Declare allStoreIDs
    const allStoreIDs = new Set<string>();

    // ✅ Collect all storeIDs used in cartItems
    orders.forEach(order => {
      order.cartItems.forEach((item: { storeID?: string }) => {
        if (item.storeID) {
          allStoreIDs.add(item.storeID);
        }
      });
    });

    // ✅ Fetch all stores at once
    const storeIDList = Array.from(allStoreIDs);
    const stores = await db
      .collection('store_record')
      .find({ storeID: { $in: storeIDList } })
      .toArray();

    // ✅ Create a quick lookup map: { storeID: storeName }
    const storeMap: Record<string, string> = {};
    stores.forEach(store => {
      storeMap[store.storeID] = store.storeName || 'Unnamed Store';
    });

    // ✅ Add vendorName to each cart item
    const enrichedOrders = orders.map(order => {
      const enrichedItems = order.cartItems.map((item: any) => ({
        ...item,
        vendorName: storeMap[item.storeID] || 'Unknown Vendor',
      }));
      return {
        ...order,
        cartItems: enrichedItems,
      };
    });

    return NextResponse.json(enrichedOrders);
  } catch (err) {
    console.error('Order Fetch Error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
