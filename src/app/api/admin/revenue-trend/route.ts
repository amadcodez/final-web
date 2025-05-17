import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const getRangeMonths = (range: string) => {
  switch (range) {
    case "3m":
      return 3;
    case "1y":
      return 12;
    case "6m":
    default:
      return 6;
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "6m";
    const months = getRangeMonths(range);

    const client = await clientPromise;
    const db = client.db("myDBClass");
    const orders = await db.collection("orders").find().toArray();

    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const monthlyRevenue: Record<string, number> = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (isNaN(orderDate.getTime()) || orderDate < fromDate) return;

      const key = orderDate.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const total = order.total || 0;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + total;
    });

    const labels = Array.from({ length: months }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
      return date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
    });

    const finalData = labels.map((label) => ({
      name: label.split(" ")[0],
      revenue: monthlyRevenue[label] || 0,
    }));

    return NextResponse.json(finalData);
  } catch (err) {
    console.error("🔥 Revenue API Error:", err);
    return NextResponse.json({ error: "Failed to load revenue data" }, { status: 500 });
  }
}
