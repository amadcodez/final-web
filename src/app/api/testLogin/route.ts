import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('myDBClass');
    const users = db.collection('customersdata');

    // find the user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'No such user' }, { status: 404 });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    // success – return minimal profile
    return NextResponse.json(
      { email: user.email },
      { status: 200 }
    );
  } catch (err) {
    console.error('testLogin error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
