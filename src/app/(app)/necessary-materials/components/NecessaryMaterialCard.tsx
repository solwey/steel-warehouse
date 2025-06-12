import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Material,
  NecessaryMaterial as PrismaNecessaryMaterial,
  UrgencyLevel,
  Order
} from '@prisma/client';
import { ChemicalCompositionTable } from '@/components/ChemicalCompositionTable';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Calendar,
  Ruler,
  Scale,
  Hash,
  MessageSquare,
  Pencil,
  Trash2,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { OrderHistoryDialog } from '@/components/OrderHistoryDialog';

export interface NecessaryMaterial extends PrismaNecessaryMaterial {
  material: Material;
}

interface Props {
  item: NecessaryMaterial;
  onEdit: () => void;
}

export function NecessaryMaterialCard({ item, onEdit }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/necessary-materials/${item.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete necessary material');
      }

      toast.success('Necessary material deleted');
      // The parent component will handle refreshing the list
    } catch (error) {
      toast.error('Failed to delete necessary material');
      console.error('Error deleting necessary material:', error);
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

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-xl">{item.material.name}</h3>
                <Badge className={getUrgencyColor(item.urgency)}>{item.urgency}</Badge>
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
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Required Weight</p>
                <p className="text-sm text-muted-foreground">{item.required_weight} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Material ID</p>
                <p className="text-sm text-muted-foreground">{item.material.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Required Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  {item.required_thickness} mm × {item.required_width} mm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Request ID</p>
                <p className="text-sm text-muted-foreground">{item.id}</p>
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

function getUrgencyColor(urgency: UrgencyLevel) {
  switch (urgency.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
