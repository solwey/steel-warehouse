import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { InventoryStatus } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        material_id: data.material_id,
        coil_number: data.coil_number,
        thickness: parseFloat(data.thickness),
        width: parseFloat(data.width),
        weight: parseFloat(data.weight),
        location: data.location,
        supplier: data.supplier,
        date_received: new Date(data.date_received),
        status: data.status as InventoryStatus,
        comment: data.comment
      },
      include: {
        material: true
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.inventoryItem.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
}
