'use client';

import { ChemicalCompositionTable } from '@/components/ChemicalCompositionTable';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem as PrismaInventoryItem, Material } from '@prisma/client';

export interface InventoryItem extends PrismaInventoryItem {
  material: Material;
}

interface Props {
  item: InventoryItem;
}

export function InventoryItemCard({ item }: Props) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.material.name}</h3>
        <p className="text-sm text-muted-foreground">{item.location}</p>
        <p className="text-sm">Status: {item.status}</p>
        <p className="text-sm">Weight: {item.weight} kg</p>
        <p className="text-sm">Grade: {item.material.grade}</p>

        {item.material.description && (
          <p className="text-sm text-muted-foreground">Description: {item.material.description}</p>
        )}

        {item.material.chemical_composition && (
          <ChemicalCompositionTable composition={item.material.chemical_composition} />
        )}
      </CardContent>
    </Card>
  );
}
