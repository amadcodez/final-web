import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('MultiStore');

    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const sort = url.searchParams.get('sort');

    const query: any = {}; // 🟢 Default: empty query

    // 🟢 If category is selected, add it to query
    if (category) {
      query.category = category; // ✅ Corrected here
    }

    let sortOption: any = {}; // 🟢 Default: no sorting

    // 🟢 Sorting options
    if (sort === 'price-asc') {
      sortOption = { itemPrice: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { itemPrice: -1 };
    }

    const products = await db
      .collection('item_record')
      .find(query)
      .sort(sortOption)
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
