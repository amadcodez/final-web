// app/api/testRegister/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Basic validation
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Connect to Mongo
    const client = await clientPromise
    const db = client.db('myDBClass')
    const coll = db.collection('customersdata')

    // Check for existing user
    const exists = await coll.findOne({ email })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10)

    // Insert new customer
    await coll.insertOne({
      userType: 'customer',
      email,
      password: hashed,
      createdAt: new Date()
    })

    return NextResponse.json({ message: 'User created' }, { status: 201 })
  } catch (err) {
    console.error('testRegister error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
