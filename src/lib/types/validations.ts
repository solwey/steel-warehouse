'use client';

import * as z from 'zod';

export const todoFormSchema = z.object({
  title: z
    .string({
      required_error: 'Please enter a Title.'
    })
    .max(30, {
      message: 'Title must not be longer than 30 characters.'
    }),
  description: z.string().min(8, {
    message: 'Description Must be at least 8 characters'
  })
});

export const DisplayNameFormSchema = z.object({
  display_name: z
    .string()
    .min(2, {
      message: 'Display Name must be at least 2 characters.'
    })
    .max(30, {
      message: 'Display Name must not be longer than 30 characters.'
    })
});

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export const OrgInviteFormSchema = z.object({
  email: z.string().email(),
  role: z.string({ required_error: 'Please Select a Role.' })
});

export const OrgFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Org name must be at least 3 characters.'
    })
    .max(24, {
      message: 'Org name must not be longer than 24 characters.'
    })
});

export type DisplayNameFormValues = z.infer<typeof DisplayNameFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type OrgInviteFormValues = z.infer<typeof OrgInviteFormSchema>;
export type todoFormValues = z.infer<typeof todoFormSchema>;
export type OrgFormValues = z.infer<typeof OrgFormSchema>;
