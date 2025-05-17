import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function DELETE(req: Request) {
  const { storeID, itemID, itemIDs } = await req.json();

  if (!storeID) {
    return NextResponse.json({ message: "Missing store ID." }, { status: 400 });
  }

  await connectToDB();

  try {
    // 🧠 If itemIDs array is provided, delete in bulk
    if (Array.isArray(itemIDs) && itemIDs.length > 0) {
      const result = await Item.deleteMany({
        _id: { $in: itemIDs },
        storeID,
      });

      return NextResponse.json({
        message: `${result.deletedCount} item(s) deleted successfully.`,
      });
    }

    // ✂️ Else fallback to single delete
    if (!itemID) {
      return NextResponse.json(
        { message: "Missing item ID for single deletion." },
        { status: 400 }
      );
    }

    const deletedItem = await Item.findOneAndDelete({ _id: itemID, storeID });

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "Unknown server error." }, { status: 500 });
    }
  }
}
