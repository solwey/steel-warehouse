import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Order, PaymentStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, DollarSign, Package, Truck, User } from 'lucide-react';

interface OrderHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  materialName: string;
}

export function OrderHistoryDialog({
  isOpen,
  onClose,
  orders,
  materialName
}: OrderHistoryDialogProps) {
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

  const getPaymentStatusColor = (status: PaymentStatus) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order History - {materialName}</DialogTitle>
          <DialogDescription>View the complete order history for this material</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 space-y-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Order #{order.order_number}</h4>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Quantity: {order.quantity} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total: ${order.total_price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Supplier: {order.supplier}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Expected:{' '}
                        {order.expected_delivery
                          ? new Date(order.expected_delivery).toLocaleDateString()
                          : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Actual:{' '}
                        {order.actual_delivery
                          ? new Date(order.actual_delivery).toLocaleDateString()
                          : 'Not delivered'}
                      </span>
                    </div>
                  </div>
                </div>

                {order.notes && <p className="text-sm text-muted-foreground">{order.notes}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
