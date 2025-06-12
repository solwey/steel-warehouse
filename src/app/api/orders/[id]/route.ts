import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    const order = await prisma.order.update({
      where: {
        id: params.id
      },
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
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.order.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
