'use client';

import React, { useState } from 'react';
import { ChemicalCompositionTable } from '@/components/ChemicalCompositionTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem as PrismaInventoryItem, Material, Order } from '@prisma/client';
import {
  Package,
  MapPin,
  Scale,
  Hash,
  Calendar,
  Building2,
  MessageSquare,
  Pencil,
  Trash2,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { OrderHistoryDialog } from '@/components/OrderHistoryDialog';

export interface InventoryItem extends PrismaInventoryItem {
  material: Material;
}

interface Props {
  item: InventoryItem;
  onEdit: () => void;
}

export function InventoryItemCard({ item, onEdit }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/inventory/${item.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory item');
      }

      toast.success('Inventory item deleted');
      // The parent component will handle refreshing the list
    } catch (error) {
      toast.error('Failed to delete inventory item');
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleViewHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders?materialId=${item.material.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      setOrders(data);
      setIsHistoryOpen(true);
    } catch (error) {
      toast.error('Failed to fetch order history');
      console.error('Error fetching order history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'scrap':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-xl">{item.material.name}</h3>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.material.grade}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleViewHistory}
                disabled={isLoading}
                className="h-9 w-9 rounded-lg"
              >
                <History className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-9 w-9 rounded-lg">
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-9 w-9 rounded-lg"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Weight</p>
                <p className="text-sm text-muted-foreground">{item.weight} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Coil Number</p>
                <p className="text-sm text-muted-foreground">{item.coil_number || '—'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  {item.thickness} mm × {item.width} mm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Supplier</p>
                <p className="text-sm text-muted-foreground">{item.supplier}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date Received</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date_received).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {item.comment && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Comment</p>
              </div>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </div>
          )}

          {item.material.description && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{item.material.description}</p>
            </div>
          )}

          {item.material.chemical_composition && (
            <div>
              <h4 className="text-sm font-medium mb-3">Chemical Composition</h4>
              <ChemicalCompositionTable composition={item.material.chemical_composition} />
            </div>
          )}
        </CardContent>
      </Card>

      <OrderHistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        materialName={item.material.name}
      />
    </>
  );
}
