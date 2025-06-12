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
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Material,
  NecessaryMaterial as PrismaNecessaryMaterial,
  UrgencyLevel
} from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

const necessaryMaterialSchema = z.object({
  material_id: z.string().min(1, 'Material is required'),
  required_thickness: z.number().min(0, 'Required thickness must be at least 0'),
  required_width: z.number().min(0, 'Required width must be at least 0'),
  required_weight: z.number().min(0, 'Required weight must be at least 0'),
  due_date: z.string().min(1, 'Due date is required'),
  urgency: z.nativeEnum(UrgencyLevel),
  comment: z.string().optional()
});

type NecessaryMaterialFormData = z.infer<typeof necessaryMaterialSchema>;

interface NecessaryMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: Material[];
  item?: PrismaNecessaryMaterial;
  onSuccess: () => void;
}

export function NecessaryMaterialDialog({
  open,
  onOpenChange,
  materials,
  item,
  onSuccess
}: NecessaryMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<NecessaryMaterialFormData>({
    resolver: zodResolver(necessaryMaterialSchema),
    defaultValues: {
      urgency: UrgencyLevel.medium
    }
  });

  useEffect(() => {
    if (item) {
      reset({
        material_id: item.material_id,
        required_thickness: item.required_thickness,
        required_width: item.required_width,
        required_weight: item.required_weight,
        urgency: item.urgency,
        due_date: new Date(item.due_date).toISOString().split('T')[0],
        comment: item.comment || ''
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: NecessaryMaterialFormData) => {
    try {
      const response = await fetch(`/api/necessary-materials${item ? `/${item.id}` : ''}`, {
        method: item ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save necessary material');
      }

      toast.success(item ? 'Necessary material updated' : 'Necessary material created');
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error('Failed to save necessary material');
      console.error('Error saving necessary material:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Necessary Material' : 'Add Necessary Material'}</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="required_thickness">Required Thickness (mm)</Label>
              <Input
                id="required_thickness"
                type="number"
                step="0.01"
                {...register('required_thickness', { valueAsNumber: true })}
                defaultValue={watch('required_thickness') || ''}
              />
              {errors.required_thickness && (
                <p className="text-sm text-red-500">{errors.required_thickness.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_width">Required Width (mm)</Label>
              <Input
                id="required_width"
                type="number"
                step="0.01"
                {...register('required_width', { valueAsNumber: true })}
                defaultValue={watch('required_width') || ''}
              />
              {errors.required_width && (
                <p className="text-sm text-red-500">{errors.required_width.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="required_weight">Required Weight (kg)</Label>
            <Input
              id="required_weight"
              type="number"
              step="0.01"
              {...register('required_weight', { valueAsNumber: true })}
              defaultValue={watch('required_weight') || ''}
            />
            {errors.required_weight && (
              <p className="text-sm text-red-500">{errors.required_weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
              defaultValue={watch('due_date') || ''}
            />
            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              defaultValue={item?.urgency || UrgencyLevel.medium}
              onValueChange={(value) => setValue('urgency', value as UrgencyLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UrgencyLevel.high}>High</SelectItem>
                <SelectItem value={UrgencyLevel.medium}>Medium</SelectItem>
                <SelectItem value={UrgencyLevel.low}>Low</SelectItem>
              </SelectContent>
            </Select>
            {errors.urgency && <p className="text-sm text-red-500">{errors.urgency.message}</p>}
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
