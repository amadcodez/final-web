export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const storeID = req.nextUrl.searchParams.get('storeID');

    const client = await clientPromise;
    const db = client.db('myDBClass');
    const orders = await db
      .collection('orders')
      .find({ 'cartItems.storeID': storeID })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
