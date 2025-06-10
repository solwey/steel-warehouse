import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupBy = searchParams.get('groupBy');
  const urgency = searchParams.get('urgency');

  let whereClause = {};
  if (urgency) {
    whereClause = { urgency };
  }

  const items = await prisma.necessaryMaterial.findMany({
    where: whereClause,
    include: {
      material: true
    }
  });

  let grouped: Record<string, typeof items> = {};

  if (groupBy === 'urgency') {
    grouped = items.reduce(
      (acc, item) => {
        acc[item.urgency] = acc[item.urgency] || [];
        acc[item.urgency].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  } else if (groupBy === 'material') {
    grouped = items.reduce(
      (acc, item) => {
        acc[item.material.name] = acc[item.material.name] || [];
        acc[item.material.name].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  } else if (groupBy === 'due_date') {
    grouped = items.reduce(
      (acc, item) => {
        const dateKey = item.due_date.toISOString().split('T')[0];
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  } else {
    grouped = { all: items };
  }

  return NextResponse.json(grouped);
}
