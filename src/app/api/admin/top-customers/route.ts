import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myDBClass");

    const result = await db.collection("orders").aggregate([
      {
        $group: {
          _id: "$email",
          count: { $sum: 1 },
          name: { $first: "$firstName" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]).toArray();

    const formatted = result.map((entry) => ({
      name: entry.name || "Unknown",
      email: entry._id,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("🔥 Error fetching top customers:", error);
    return NextResponse.json({ error: "Failed to load top customers" }, { status: 500 });
  }
}
