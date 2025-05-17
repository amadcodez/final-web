import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const getDaysAndFormat = (range: string) => {
  switch (range) {
    case "30d":
      return { days: 30, format: "%Y-%m-%d" };
    case "3m":
      return { days: 90, format: "%Y-%m-%d" };
    case "1y":
      return { days: 365, format: "%Y-%m" };
    case "7d":
    default:
      return { days: 7, format: "%Y-%m-%d" };
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const { days, format } = getDaysAndFormat(range);
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const orders = await db.collection("orders").find().toArray();

    const filtered = orders.filter((order) => {
      if (!order.date) return false;
      const orderDate = new Date(order.date);
      return orderDate >= fromDate;
    });

    const grouped = new Map<string, number>();

    filtered.forEach((order) => {
      const orderDate = new Date(order.date);
      const key = format === "%Y-%m"
        ? orderDate.toISOString().slice(0, 7)
        : orderDate.toISOString().slice(0, 10);

      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    const finalData = Array.from(grouped.entries()).map(([name, orders]) => ({
      name,
      orders,
    }));

    return NextResponse.json(finalData);
  } catch (error) {
    console.error("🔥 FINAL SALES TREND ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
