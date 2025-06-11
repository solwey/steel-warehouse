import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { UrgencyLevel } from '@prisma/client';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const item = await prisma.necessaryMaterial.update({
      where: { id: params.id },
      data: {
        material_id: data.material_id,
        required_thickness: parseFloat(data.required_thickness),
        required_width: parseFloat(data.required_width),
        required_weight: parseFloat(data.required_weight),
        due_date: new Date(data.due_date),
        urgency: data.urgency as UrgencyLevel,
        comment: data.comment
      },
      include: {
        material: true
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating necessary material:', error);
    return NextResponse.json({ error: 'Failed to update necessary material' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.necessaryMaterial.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting necessary material:', error);
    return NextResponse.json({ error: 'Failed to delete necessary material' }, { status: 500 });
  }
}
