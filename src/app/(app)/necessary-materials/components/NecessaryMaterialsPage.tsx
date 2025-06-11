'use client';

import React, { useState } from 'react';
import { NecessaryMaterialCard } from './NecessaryMaterialCard';
import { NecessaryMaterialDialog } from './NecessaryMaterialDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Material, NecessaryMaterial, UrgencyLevel } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface NecessaryMaterialsPageProps {
  initialItems: (NecessaryMaterial & { material: Material })[];
  materials: Material[];
}

export function NecessaryMaterialsPage({ initialItems, materials }: NecessaryMaterialsPageProps) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NecessaryMaterial | undefined>();

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.material.name.toLowerCase().includes(query) ||
      item.material.grade.toLowerCase().includes(query) ||
      item.urgency.toLowerCase().includes(query);

    const matchesUrgency = urgencyFilter === 'all' || item.urgency === urgencyFilter;
    const matchesMaterial = materialFilter === 'all' || item.material_id === materialFilter;

    return matchesSearch && matchesUrgency && matchesMaterial;
  });

  const handleSuccess = () => {
    // Refresh the items list
    fetch('/api/necessary-materials')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error refreshing items:', error));
  };

  const handleEdit = (item: NecessaryMaterial) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Necessary Materials</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search necessary materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={urgencyFilter}
              onValueChange={(value) => setUrgencyFilter(value as UrgencyLevel | 'all')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value={UrgencyLevel.high}>High</SelectItem>
                <SelectItem value={UrgencyLevel.medium}>Medium</SelectItem>
                <SelectItem value={UrgencyLevel.low}>Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredItems.map((item) => (
          <NecessaryMaterialCard key={item.id} item={item} onEdit={() => handleEdit(item)} />
        ))}
      </div>

      <NecessaryMaterialDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        materials={materials}
        item={selectedItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
