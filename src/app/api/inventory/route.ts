import { NextResponse } from 'next/server';
import { InventoryStatus } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        material: true
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await prisma.inventoryItem.create({
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
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}
