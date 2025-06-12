import React from 'react';
import { Order, Material } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { OrderDialog } from '../../../../components/OrderDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface OrderCardProps {
  order: Order & { material: Material };
  onUpdate: () => void;
}

export function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PRODUCTION':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNPAID':
        return 'bg-gray-100 text-gray-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/orders/${order.id}`);
      toast.success('Order deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await axios.put(`/api/orders/${order.id}`, data);
      toast.success('Order updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-xl">
                  {order.material.name} - {order.order_number}
                </h3>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <Badge className={getPaymentStatusColor(order.payment_status)}>
                  {order.payment_status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier: {order.supplier}</p>
                  <p className="text-sm text-muted-foreground">
                    Material Grade: {order.material.grade}
                  </p>
                  <p className="text-sm text-muted-foreground">Quantity: {order.quantity} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected:{' '}
                    {order.expected_delivery
                      ? new Date(order.expected_delivery).toLocaleDateString()
                      : 'Not set'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: ${order.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-9 w-9 rounded-lg"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="h-9 w-9 rounded-lg"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        materials={[order.material]}
        order={order}
        onSubmit={handleUpdate}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
