import { NextResponse } from 'next/server';
import { UrgencyLevel } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const items = await prisma.necessaryMaterial.findMany({
      include: {
        material: true
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching necessary materials:', error);
    return NextResponse.json({ error: 'Failed to fetch necessary materials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await prisma.necessaryMaterial.create({
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
    console.error('Error creating necessary material:', error);
    return NextResponse.json({ error: 'Failed to create necessary material' }, { status: 500 });
  }
}
