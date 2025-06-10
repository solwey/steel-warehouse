import { NextResponse } from 'next/server';

import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupBy = searchParams.get('groupBy');
  const showOnlyAvailable = searchParams.get('onlyAvailable') === 'true';

  let whereClause = {};
  if (showOnlyAvailable) {
    whereClause = { status: 'available' };
  }

  const items = await prisma.inventoryItem.findMany({
    where: whereClause,
    include: {
      material: true
    }
  });

  let grouped = {};

  if (groupBy === 'location') {
    grouped = items.reduce(
      (acc, item) => {
        acc[item.location] = acc[item.location] || [];
        acc[item.location].push(item);
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
  } else if (groupBy === 'status') {
    grouped = items.reduce(
      (acc, item) => {
        acc[item.status] = acc[item.status] || [];
        acc[item.status].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  } else {
    grouped = { all: items };
  }

  return NextResponse.json(grouped);
}
