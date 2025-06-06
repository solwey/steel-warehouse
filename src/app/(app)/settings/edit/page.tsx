'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';

import { toast } from 'react-toastify';
import { getUser } from '@/lib/utils/auth';

const EditUserSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    display_name: z.string().optional(),
    role: z.enum(['ADMIN', 'USER']),
    password: z.string().optional(),
    confirm_password: z.string().optional()
  })
  .refine(
    (data) =>
      !data.password || data.password.length === 0 || data.password === data.confirm_password,
    {
      message: 'Passwords do not match',
      path: ['confirm_password']
    }
  );

type EditUserFormValues = z.infer<typeof EditUserSchema>;

export default function EditSettingsPage() {
  const router = useRouter();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: '',
      email: '',
      display_name: '',
      role: 'USER',
      password: '',
      confirm_password: ''
    }
  });

  const localUser = getUser();

  useEffect(() => {
    axios
      .get(`/api/users/${localUser.id}`)
      .then(({ data }) => {
        form.reset({
          name: data.name,
          email: data.email,
          display_name: data.display_name || '',
          role: data.access_role || 'USER',
          password: '',
          confirm_password: ''
        });
      })
      .catch(() => {
        toast.error('Failed to load user data');
      });
  }, []);

  const onSubmit = async (values: EditUserFormValues) => {
    try {
      const { confirm_password, ...rest } = values;
      await axios.put(`/api/users/${localUser.id}`, rest);
      toast.success('Profile updated successfully');
      router.push('/settings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

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
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Optional display name"
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
                  <select {...field} className="border p-2 rounded w-full min-w-[320px]">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Leave blank to keep current"
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
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    {...field}
                    className="w-full min-w-[320px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
