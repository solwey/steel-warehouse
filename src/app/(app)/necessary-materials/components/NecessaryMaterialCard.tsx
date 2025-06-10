import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Material, NecessaryMaterial as PrismaNecessaryMaterial } from '@prisma/client';
import { ChemicalCompositionTable } from '@/components/ChemicalCompositionTable';

export interface NecessaryMaterial extends PrismaNecessaryMaterial {
  material: Material;
}

interface NecessaryMaterialCardProps {
  item: NecessaryMaterial;
}

const NecessaryMaterialCard: React.FC<NecessaryMaterialCardProps> = ({ item }) => {
  return (
    <Card key={item.id} className="w-full">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.material.name}</h3>
        <p className="text-sm text-muted-foreground">Urgency: {item.urgency}</p>
        <p className="text-sm">
          Due date: {item.due_date ? new Date(item.due_date).toLocaleDateString() : '—'}
        </p>
        <p className="text-sm">Required width: {item.required_width}</p>
        <p className="text-sm">Required thickness: {item.required_thickness}</p>
        <p className="text-sm">Required weight: {item.required_weight}</p>
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
};

export default NecessaryMaterialCard;
