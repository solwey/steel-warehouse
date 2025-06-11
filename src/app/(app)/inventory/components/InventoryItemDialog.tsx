import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { InventoryItem, Material, InventoryStatus } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

const inventoryItemSchema = z.object({
  material_id: z.string().min(1, 'Material is required'),
  coil_number: z.string().min(1, 'Coil number is required'),
  thickness: z.number().min(0, 'Thickness must be a non-negative number'),
  width: z.number().min(0, 'Width must be a non-negative number'),
  weight: z.number().min(0, 'Weight must be a non-negative number'),
  location: z.string().min(1, 'Location is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  date_received: z.string().min(1, 'Date received is required'),
  status: z.nativeEnum(InventoryStatus),
  comment: z.string().optional()
});

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

interface InventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: Material[];
  item?: InventoryItem;
  onSuccess: () => void;
}

export function InventoryItemDialog({
  open,
  onOpenChange,
  materials,
  item,
  onSuccess
}: InventoryItemDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      status: InventoryStatus.available
    }
  });

  useEffect(() => {
    if (item) {
      reset({
        material_id: item.material_id,
        coil_number: item.coil_number,
        thickness: item.thickness,
        width: item.width,
        weight: item.weight,
        location: item.location,
        supplier: item.supplier,
        date_received: new Date(item.date_received).toISOString().split('T')[0],
        status: item.status,
        comment: item.comment || ''
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      const response = await fetch(`/api/inventory${item ? `/${item.id}` : ''}`, {
        method: item ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save inventory item');
      }

      toast.success(item ? 'Inventory item updated' : 'Inventory item created');
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error('Failed to save inventory item');
      console.error('Error saving inventory item:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material_id">Material</Label>
            <Select
              defaultValue={item?.material_id}
              onValueChange={(value) => setValue('material_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.material_id && (
              <p className="text-sm text-red-500">{errors.material_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coil_number">Coil Number</Label>
            <Input
              id="coil_number"
              {...register('coil_number')}
              value={watch('coil_number') || ''}
            />
            {errors.coil_number && (
              <p className="text-sm text-red-500">{errors.coil_number.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thickness">Thickness (mm)</Label>
              <Input
                id="thickness"
                type="number"
                step="0.01"
                {...register('thickness', { valueAsNumber: true })}
                value={watch('thickness') || ''}
              />
              {errors.thickness && (
                <p className="text-sm text-red-500">{errors.thickness.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Width (mm)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                {...register('width', { valueAsNumber: true })}
                value={watch('width') || ''}
              />
              {errors.width && <p className="text-sm text-red-500">{errors.width.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              {...register('weight', { valueAsNumber: true })}
              value={watch('weight') || ''}
            />
            {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} value={watch('location') || ''} />
            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" {...register('supplier')} value={watch('supplier') || ''} />
            {errors.supplier && <p className="text-sm text-red-500">{errors.supplier.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_received">Date Received</Label>
            <Input
              id="date_received"
              type="date"
              {...register('date_received')}
              value={watch('date_received') || ''}
            />
            {errors.date_received && (
              <p className="text-sm text-red-500">{errors.date_received.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={item?.status || InventoryStatus.available}
              onValueChange={(value) => setValue('status', value as InventoryStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={InventoryStatus.available}>Available</SelectItem>
                <SelectItem value={InventoryStatus.reserved}>Reserved</SelectItem>
                <SelectItem value={InventoryStatus.used}>In Use</SelectItem>
                <SelectItem value={InventoryStatus.scrap}>Scrap</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Input id="comment" {...register('comment')} value={watch('comment') || ''} />
            {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
