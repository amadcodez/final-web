import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// 🔹 Utility: Generate random Order ID
function generateOrderID(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let orderId = '';
  for (let i = 0; i < length; i++) {
    orderId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return orderId;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db('myDBClass');
    const orders = db.collection('orders');

    // 🔹 Generate and attach order ID and date
    const orderID = generateOrderID();
    const fullOrder = {
      ...body,
      orderID,
      date: new Date().toISOString(),
    };

    await orders.insertOne(fullOrder);

    // 🔹 Destructure values for email
    const { email, firstName, cartItems, total, paymentMethod } = fullOrder;

    // 🔹 Format item list HTML
    const formattedItems = cartItems
      .map(
        (item: any) =>
          `<p>• ${item.title} – Rs.${item.price} × ${item.quantity}</p>`
      )
      .join('');

    // 🔹 Branded email HTML content
    const htmlContent = `
  <div style="max-width:600px;margin:30px auto;padding:30px;border-radius:8px;font-family:Arial,sans-serif;background:#fff;border:1px solid #e2e2e2;text-align:center">
    <h2 style="font-size:22px;margin-bottom:10px">Order Confirmation</h2>
    <p style="font-size:16px;color:#333">Thanks for your order, <strong>${firstName}</strong>!</p>
    <p style="margin:15px 0">Your order ID is shown below:</p>
    <div style="background:#ff4d00;color:#fff;display:inline-block;padding:12px 24px;border-radius:6px;font-size:20px;font-weight:bold;letter-spacing:1px;margin-bottom:20px;">
      ${orderID}
    </div>

    <div style="text-align:left;margin-top:30px;background:#f9f9f9;padding:20px;border-radius:6px">
      <h3 style="margin:0 0 10px">Order Summary:</h3>
      ${cartItems
        .map(
          (item: any) =>
            `<p style="margin:5px 0;font-size:14px">• ${item.title} – Rs.${item.price} × ${item.quantity}</p>`
        )
        .join('')}
      <p style="margin:10px 0;font-weight:bold">Total: Rs.${total}</p>
      <p style="margin:5px 0">Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></p>
    </div>

    <div style="text-align:left;margin-top:20px;background:#f1f1f1;padding:20px;border-radius:6px">
      <h3 style="margin:0 0 10px">Shipping Information:</h3>
      <p style="margin:5px 0;font-size:14px"><strong>Name:</strong> ${firstName} ${body.lastName || ''}</p>
      <p style="margin:5px 0;font-size:14px"><strong>Phone:</strong> ${body.phone}</p>
      <p style="margin:5px 0;font-size:14px"><strong>Address:</strong> ${body.address}, ${body.city}</p>
    </div>

    <p style="font-size:12px;color:#999;margin-top:30px">
      You'll receive another email when your order is shipped. <br />
      If you didn’t place this order, you can safely ignore this message.
    </p>

    <p style="font-size:13px;color:#888;margin-top:20px">— Team Covo</p>
  </div>
`;
    // 🔹 Nodemailer transport setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for port 465, false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    

    await transporter.sendMail({
      from: `"Covo Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${orderID}`,
      html: htmlContent,
    });

    return new NextResponse(
      JSON.stringify({ success: true, orderID }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Submit Order Error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Order failed' }),
      { status: 500 }
    );
  }
}
