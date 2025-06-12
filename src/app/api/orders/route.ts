import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('materialId');

    const orders = await prisma.order.findMany({
      where: materialId
        ? {
            material_id: materialId
          }
        : undefined,
      include: {
        material: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const order = await prisma.order.create({
      data: {
        material_id: data.material_id,
        order_number: data.order_number,
        unit_price: data.unit_price,
        quantity: data.quantity,
        total_price: data.unit_price * data.quantity,
        status: data.status as OrderStatus,
        supplier: data.supplier,
        expected_delivery: data.expected_delivery ? new Date(data.expected_delivery) : null,
        payment_status: data.payment_status as PaymentStatus,
        payment_due_date: data.payment_due_date ? new Date(data.payment_due_date) : null,
        shipping_address: data.shipping_address,
        contact_person: data.contact_person,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        notes: data.notes
      },
      include: {
        material: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
