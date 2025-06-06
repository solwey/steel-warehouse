'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { toast } from 'react-toastify';

const UserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Minimum 6 characters').or(z.literal('')),
  role: z.enum(['ADMIN', 'USER']).default('USER')
});

type UserFormValues = z.infer<typeof UserFormSchema>;

export default function UserFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get('id');
  const isEdit = Boolean(userId);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER'
    }
  });

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`/api/users/${userId}`)
        .then(({ data }) => {
          form.reset({
            name: data.name,
            email: data.email,
            password: '',
            role: data.access_role
          });
        })
        .catch(() => {
          toast.error('Failed to load user');
        });
    }
  }, [userId]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await axios.put(`/api/users/${userId}`, payload);
        toast.success('User updated successfully');
      } else {
        await axios.post('/api/users', payload);
        toast.success('User created successfully');
      }
      router.push('/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit User' : 'Create User'}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full min-w-[320px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="w-full min-w-[320px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password {isEdit && <span className="text-sm text-gray-500">(optional)</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                    className="w-full min-w-[320px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select {...field} className="border p-2 rounded w-full">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full min-w-[320px]">
            {isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
