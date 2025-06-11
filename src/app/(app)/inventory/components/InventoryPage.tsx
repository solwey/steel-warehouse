'use client';

import React, { useState } from 'react';
import { InventoryItemCard } from './InventoryItemCard';
import { InventoryItemDialog } from './InventoryItemDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Material, InventoryItem, InventoryStatus } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface InventoryPageProps {
  initialItems: (InventoryItem & { material: Material })[];
  materials: Material[];
}

export function InventoryPage({ initialItems, materials }: InventoryPageProps) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all');
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.material.name.toLowerCase().includes(query) ||
      item.material.grade.toLowerCase().includes(query) ||
      item.coil_number.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.supplier.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesMaterial = materialFilter === 'all' || item.material_id === materialFilter;

    return matchesSearch && matchesStatus && matchesMaterial;
  });

  const handleSuccess = () => {
    // Refresh the items list
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error refreshing items:', error));
  };

  const handleEdit = (item: InventoryItem) => {
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
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as InventoryStatus | 'all')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={InventoryStatus.available}>Available</SelectItem>
                <SelectItem value={InventoryStatus.reserved}>Reserved</SelectItem>
                <SelectItem value={InventoryStatus.used}>In Use</SelectItem>
                <SelectItem value={InventoryStatus.scrap}>Scrap</SelectItem>
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
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredItems.map((item) => (
          <InventoryItemCard key={item.id} item={item} onEdit={() => handleEdit(item)} />
        ))}
      </div>

      <InventoryItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        materials={materials}
        item={selectedItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
