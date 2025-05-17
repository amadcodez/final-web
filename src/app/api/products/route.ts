export const dynamic = 'force-dynamic'; // 🟢 Still keep it

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('MultiStore');

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    const products = await db.collection('item_record').find(query).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to load products' }), {
      status: 500,
    });
  }
}
